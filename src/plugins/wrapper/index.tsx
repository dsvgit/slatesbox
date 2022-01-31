import React from "react";
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSlate,
} from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import type { Transform } from "@dnd-kit/utilities";
import cn from "classnames";
import { Editor, Path, Transforms, Element } from "slate";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";

import {
  getFoldedIndexes,
  getSemanticChildren,
  isFoldingElement,
} from "plugins/folding/utils";
import { isImageElement } from "plugins/image/utils";
import renderFoldingArrow from "plugins/folding/renderFoldingArrow";
import renderDndHandle from "plugins/dnd/renderDndHandle";
import { useDndContext } from "@dnd-kit/core";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes: slateAttributes, children, element } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);
  const index = path[0];
  const id = String(index);
  const isFocused = useFocused();

  const isFirstInSelection = editor.selection
    ? Path.equals(
        Editor.edges(editor, editor.selection)[0].path.slice(0, 1),
        path
      )
    : false;

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

  // const context = useDndContext();
  // if (context.active) {
  //   const draggingElement = editor.children[Number(context.active.id)];
  //   const semanticChildren = getSemanticChildren(editor, draggingElement);
  //
  //   if (semanticChildren.includes(element)) {
  //     return null;
  //   }
  // }

  const handleFold = () => {
    Transforms.setNodes(
      editor,
      { folded: isFoldingElement(element) && !element.folded },
      {
        at: path,
        match: (node) => node === element,
      }
    );
  };

  const indexes = getFoldedIndexes(editor.children);
  const folded = indexes.has(path[0]);

  if (folded) {
    return null;
  }

  return renderWrapperContent({
    ref: (ref) => {
      slateAttributes.ref.current = ref;
      setNodeRef(ref);
    },
    element,
    transition,
    transform,
    listeners,
    isDragging,
    handle: isFirstInSelection && isFocused,
    attributes: {
      ...slateAttributes,
      ...sortableAttributes,
    },
    onFold: handleFold,
    children,
  });
};

type RenderContentProps = {
  ref?: React.Ref<HTMLDivElement>;
  element: Element;
  transition?: string | null;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
  handle?: boolean;
  attributes?: ReturnType<typeof useSortable>["attributes"] &
    RenderElementProps["attributes"];
  onFold?: React.MouseEventHandler;
  isDragOverlay?: boolean;
};

export const renderWrapperContent = ({
  ref,
  element,
  children,
  transition,
  transform,
  listeners,
  isDragging = false,
  handle = false,
  attributes,
  onFold,
  isDragOverlay = false,
}: React.PropsWithChildren<RenderContentProps>) => {
  return (
    <div
      {...attributes}
      ref={ref}
      className={cn("wrapper", {
        dragging: isDragging,
        selected: handle,
        dragOverlay: isDragOverlay,
      })}
      style={
        {
          // transition,
          "--translate-x": transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          "--translate-y": transform
            ? `${Math.round(transform.y)}px`
            : undefined,
        } as React.CSSProperties
      }
      {...(isImageElement(element) && listeners)}
    >
      {renderDndHandle(listeners)}
      {isFoldingElement(element) && renderFoldingArrow(element.folded, onFold)}
      {children}
    </div>
  );
};

export default Wrapper;
