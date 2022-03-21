import React, { useEffect, useMemo } from "react";
import { Editor } from "slate";
import { useSlateStatic } from "slate-react";
import { clone } from "ramda";
import cn from "classnames";
import { useResizeDetector } from "react-resize-detector";

import { ExtendedEditor } from "slate-extended/extendedEditor";
import { RenderElementProps } from "slate-react/dist/components/editable";
import DragOverlayEditor from "components/DragOverlayEditor";

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

  return (
    <div
      ref={ref}
      contentEditable={false}
      className={cn("dragOverlay", {
        dragOverlayList: ExtendedEditor.isNestingElement(editor, element),
      })}
    >
      {element && <DragOverlayEditor initialValue={initialValue} />}
    </div>
  );
};

export const DragOverlayWrapper = (props: RenderElementProps) => {
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

export default DragOverlayContent;
