import React from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import cn from "classnames";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes, children, element } = props;

  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const index = path[0];
  const id = String(index);

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
    >
      <button contentEditable={false} className="handle" {...listeners}>
        ⠿
      </button>
      {children}
    </div>
  );
};

export default Wrapper;
