import React, { useCallback, useEffect, useMemo } from "react";
import { Editor } from "slate";
import { useSlateStatic } from "slate-react";
import { clone } from "ramda";
import cn from "classnames";
import { useResizeDetector } from "react-resize-detector";

import SlateEditor from "components/SlateEditor";
import { renderElementContent } from "hooks/useRenderElement";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { RenderElementProps } from "slate-react/dist/components/editable";

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
    if (ExtendedEditor.isNestingElement(editor, element)) {
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
        if (ExtendedEditor.isNestingElement(editor, element)) {
          element.depth -= baseDepth;
        }
      });
    } else {
      content = clone([element]);
    }

    return content;
  }, [editor.children, activeId]);

  const renderDragOverlayElement = useRenderDragOverlayElement(editor);

  return (
    <div
      ref={ref}
      contentEditable={false}
      className={cn("dragOverlay", {
        dragOverlayList: ExtendedEditor.isNestingElement(editor, element),
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
  const editor = useSlateStatic();

  const realSpacing = ExtendedEditor.isNestingElement(editor, element)
    ? 50 * element.depth
    : 0;

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

const useRenderDragOverlayElement = (editor: Editor) => {
  const renderDragOverlayElement = useCallback(
    (props) => {
      if (ExtendedEditor.isNestingElement(editor, props.element)) {
        const { attributes, element } = props;

        return (
          <DragOverlayWrapper attributes={attributes} element={element}>
            {renderElementContent(props)}
          </DragOverlayWrapper>
        );
      }

      return renderElementContent(props);
    },
    [editor]
  );

  return renderDragOverlayElement;
};

export default DragOverlayContent;
