import React from "react";
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSlate,
} from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import cn from "classnames";
import { Editor, Path, Transforms } from "slate";

import { foldedIndexes, isFoldingElement } from "plugins/folding/utils";
import { isImageElement } from "plugins/image/utils";

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
        hidden: folded,
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
      <button contentEditable={false} className="handle" {...listeners}>
        ⠿
      </button>
      {isFoldingElement(element) && (
        <button
          contentEditable={false}
          className="folding"
          style={
            {
              "--rotate": element.folded ? "0deg" : "90deg",
            } as React.CSSProperties
          }
          onClick={() => {
            Transforms.setNodes(
              editor,
              { folded: !element.folded },
              {
                at: path,
                match: (node) => node === element,
              }
            );
          }}
        >
          &gt;
        </button>
      )}
      {children}
    </div>
  );
};

export default Wrapper;
