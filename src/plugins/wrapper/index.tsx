import React from "react";
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSlate,
} from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import cn from "classnames";
import { Editor, Path } from "slate";

import { foldedIndexes } from "plugins/folding/utils";
import { isImageElement } from "plugins/image/utils";
import renderFoldingArrow from "plugins/folding/renderFoldingArrow";
import renderDndHandle from "plugins/dnd/renderDndHandle";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes, children, element } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);
  const index = path[0];
  const id = String(index);
  const isFocused = useFocused();

  const isFirstInSelection =
    editor.selection &&
    Path.equals(
      Editor.edges(editor, editor.selection)[0].path.slice(0, 1),
      path
    );

  const {
    attributes: sortableAttributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  const indexes = foldedIndexes(editor.children);
  const folded = indexes.has(path[0]);

  if (folded) {
    return null;
  }

  return (
    <div
      {...attributes}
      {...sortableAttributes}
      ref={(ref) => {
        attributes.ref.current = ref;
        setNodeRef(ref);
      }}
      className={cn("wrapper", {
        dragging: isDragging,
        selected: isFirstInSelection && isFocused,
      })}
      style={
        {
          transition,
          "--translate-x": transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          "--translate-y": transform
            ? `${Math.round(transform.y)}px`
            : undefined,
          "--index": index,
        } as React.CSSProperties
      }
      {...(isImageElement(element) && listeners)}
    >
      {renderDndHandle(listeners)}
      {renderFoldingArrow(editor, element, path)}
      {children}
    </div>
  );
};

export default Wrapper;
