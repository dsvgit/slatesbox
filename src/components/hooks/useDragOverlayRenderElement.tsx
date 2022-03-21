import React, { useCallback } from "react";
import { Editor } from "slate";
import { DefaultElement } from "slate-react";

import { ElementProps, SlatePlugin } from "plugins/types";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { DragOverlayWrapper } from "plugins/wrapper/components/DragOverlayContent";

const useDragOverlayRenderElement = (
  editor: Editor,
  plugins: SlatePlugin[]
) => {
  const renderers = plugins
    .filter((x) => x.renderElement)
    .map((x) => x.renderElement!);

  const renderElement = useCallback(
    (props) => {
      if (ExtendedEditor.isNestingElement(editor, props.element)) {
        const { attributes, element } = props;

        return (
          <DragOverlayWrapper attributes={attributes} element={element}>
            {renderElementContent(props, renderers)}
          </DragOverlayWrapper>
        );
      }

      return renderElementContent(props, renderers);
    },
    [editor]
  );

  return renderElement;
};

export default useDragOverlayRenderElement;

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
