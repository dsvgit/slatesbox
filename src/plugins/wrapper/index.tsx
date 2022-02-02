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
import { isMobile, isIOS } from "react-device-detect";

import { getFoldedIndexes, isFoldingElement } from "plugins/folding/utils";
import { isImageElement } from "plugins/image/utils";
import renderFoldingArrow from "plugins/folding/renderFoldingArrow";
import renderDndHandle from "plugins/dnd/renderDndHandle";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";
import { useDndState } from "hooks/useDndState";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes: slateAttributes, children, element } = props;
  const { activeId } = useDndState();

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

  const indexes = getFoldedIndexes(editor.children);
  const folded = indexes.has(path[0]);

  const isInViewport = useIntersectionObserver(slateAttributes.ref, [folded]);

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

  if (folded) {
    return null;
    // return (
    //   <div
    //     {...slateAttributes}
    //     {...sortableAttributes}
    //     ref={(ref) => {
    //       slateAttributes.ref.current = ref;
    //       setNodeRef(ref);
    //     }}
    //     style={
    //       {
    //         transition,
    //         "--translate-x": transform
    //           ? `${Math.round(transform.x)}px`
    //           : undefined,
    //         "--translate-y": transform
    //           ? `${Math.round(transform.y)}px`
    //           : undefined,
    //       } as React.CSSProperties
    //     }
    //     contentEditable={false}
    //   >
    //     green
    //   </div>
    // );
  }

  return (
    <div {...slateAttributes}>
      {isInViewport || activeId === id ? (
        <Sortable
          id={id}
          rootRef={slateAttributes.ref}
          element={element}
          handle={isFirstInSelection && isFocused}
          onFold={handleFold}
          isInViewport={isInViewport}
          folded={folded}
        >
          {children}
        </Sortable>
      ) : (
        <Item
          element={element}
          handle={isFirstInSelection && isFocused}
          onFold={handleFold}
          isInViewport={isInViewport}
          folded={folded}
        >
          {children}
        </Item>
      )}
    </div>
  );
};

const Sortable = ({
  id,
  rootRef,
  ...props
}: {
  id: string;
  rootRef: React.RefObject<HTMLDivElement>;
} & ItemProps) => {
  const sortableProps = useSortable({
    id,
    transition: {
      duration: 350,
      easing: "ease",
    },
  });

  useIsomorphicLayoutEffect(() => {
    sortableProps.setNodeRef(rootRef.current);
  });

  return <Item {...props} {...sortableProps} />;
};

type SortableAttributes = ReturnType<typeof useSortable>["attributes"];

type ItemProps = {
  element: Element;
  transition?: string | null;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
  isSorting?: boolean;
  handle?: boolean;
  onFold?: React.MouseEventHandler;
  isDragOverlay?: boolean;
  isInViewport?: boolean;
  folded?: boolean;
  children: React.ReactNode;
  attributes?: SortableAttributes;
};

export const Item = ({
  element,
  children,
  transition,
  transform,
  listeners,
  isDragging = false,
  isSorting = false,
  handle = false,
  onFold,
  isDragOverlay = false,
  isInViewport = false,
  folded = false,
  attributes,
}: ItemProps) => {
  return (
    <div
      {...attributes}
      className={cn("wrapper", {
        dragging: isDragging,
        selected: handle,
        dragOverlay: isDragOverlay,
        disableSelection: isIOS && isSorting,
        disableInteraction: isSorting,
        hidden: folded,
        // indicator: isDragging,
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
        } as React.CSSProperties
      }
    >
      <div className="actions">
        {renderDndHandle(listeners)}
        {isFoldingElement(element) &&
          renderFoldingArrow(element.folded, onFold)}
      </div>
      {children}
    </div>
  );
};

export default Wrapper;
