import React, { useEffect, useMemo } from "react";
import { Editor } from "slate";
import { clone } from "ramda";

import SlateEditor from "components/SlateEditor";
import { renderElementContent } from "hooks/useRenderElement";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { isListItemElement } from "plugins/list/utils";
import { RenderElementProps } from "slate-react/dist/components/editable";
import { useResizeDetector } from "react-resize-detector";
import cn from "classnames";

type Props = {
  editor: Editor;
  activeId: string;
  onHeightChange: (height: number) => void;
};

const DragOverlayContent = (props: Props) => {
  const { editor, activeId, onHeightChange } = props;
  const { ref, height = 0 } = useResizeDetector();

  useEffect(() => {
    onHeightChange(height);
  }, [height]);

  const activeIndex = editor.children.findIndex((x) => x.id === activeId);
  const element = editor.children[activeIndex];

  const initialValue = useMemo(() => {
    let content;
    if (isListItemElement(element)) {
      const semanticNode = ExtendedEditor.semanticNode(element);
      const { descendants } = semanticNode;
      const baseDepth = element.depth;

      content = clone(
        element.folded
          ? [element]
          : [
              element,
              ...descendants.filter((x) => !x.hidden).map((x) => x.element),
            ]
      );

      content.forEach((element) => {
        if (isListItemElement(element)) {
          element.depth -= baseDepth;
        }
      });
    } else {
      content = clone([element]);
    }

    return content;
  }, [editor.children, activeId]);

  return (
    <div
      ref={ref}
      contentEditable={false}
      className={cn("dragOverlay", {
        dragOverlayList: isListItemElement(element),
      })}
    >
      {element && (
        <SlateEditor
          initialValue={initialValue}
          readOnly={true}
          renderElement={renderDragOverlayElement}
        />
      )}
    </div>
  );
};

const DragOverlayWrapper = (props: RenderElementProps) => {
  const { element, children } = props;

  const realSpacing = isListItemElement(element) ? 50 * element.depth : 0;

  return (
    <div
      className="dragOverlayWrapper"
      style={
        {
          "--spacing": `${realSpacing}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

const renderDragOverlayElement = (props: RenderElementProps) => {
  if (isListItemElement(props.element)) {
    const { attributes, element } = props;

    return (
      <DragOverlayWrapper attributes={attributes} element={element}>
        {renderElementContent(props)}
      </DragOverlayWrapper>
    );
  }

  return renderElementContent(props);
};

export default DragOverlayContent;
