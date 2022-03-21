import React, { useCallback } from "react";
import { Editor } from "slate";
import { DefaultLeaf, RenderLeafProps } from "slate-react";

import { SlatePlugin } from "plugins/types";

const useRenderLeaf = (editor: Editor, plugins: SlatePlugin[]) => {
  const renderers = plugins
    .filter((x) => x.renderLeaf)
    .map((x) => x.renderLeaf!);

  return useCallback(
    (props: RenderLeafProps) => renderLeafContent(props, renderers),
    []
  );
};

export default useRenderLeaf;

export const renderLeafContent = (
  props: RenderLeafProps,
  renderers: ((props: RenderLeafProps) => JSX.Element | null)[]
) => {
  for (const render of renderers) {
    const rendered = render(props);

    if (rendered) {
      return rendered;
    }
  }

  return (
    <DefaultLeaf
      children={props.children}
      text={props.text}
      leaf={props.leaf}
      attributes={props.attributes}
    />
  );
};
