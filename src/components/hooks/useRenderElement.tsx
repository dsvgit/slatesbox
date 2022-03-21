import React, { useCallback } from "react";
import { Editor } from "slate";
import { DefaultElement, ReactEditor, RenderElementProps } from "slate-react";

import { ElementProps, SlatePlugin } from "plugins/types";
import Wrapper from "plugins/wrapper";

const useRenderElement = (editor: Editor, plugins: SlatePlugin[]) => {
  const renderers = plugins
    .filter((x) => x.renderElement)
    .map((x) => x.renderElement!);

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const { attributes, children, element } = props;

      const path = ReactEditor.findPath(editor, element);

      if (path.length === 1) {
        return (
          <Wrapper attributes={attributes} element={element}>
            {renderElementContent(
              {
                element,
                children,
              },
              renderers
            )}
          </Wrapper>
        );
      }

      return renderElementContent(
        {
          attributes,
          element,
          children,
        },
        renderers
      );
    },
    [editor]
  );

  return renderElement;
};

export default useRenderElement;

export const renderElementContent = (
  props: ElementProps,
  renderers: ((props: ElementProps) => JSX.Element | null)[]
) => {
  for (const render of renderers) {
    const rendered = render(props);

    if (rendered) {
      return rendered;
    }
  }

  return (
    <DefaultElement
      children={props.children}
      element={props.element}
      attributes={props.attributes!}
    />
  );
};
