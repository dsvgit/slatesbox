import React, { memo, useCallback } from "react";
import { RenderElementProps, useSelected, useSlateStatic } from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import type { Transform } from "@dnd-kit/utilities";
import cn from "classnames";
import { Element } from "slate";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { isIOS } from "react-device-detect";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";

import { useDndState } from "hooks/useDndState";
import useWrapperIntersectionObserver from "plugins/wrapper/useWrapperIntersectionObserver";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { foldElement } from "slate-extended/transforms/foldElement";
import DragHandle from "plugins/wrapper/components/DragHandle";
import FoldingArrow from "plugins/wrapper/components/FoldingArrow";
import FoldingLine from "plugins/wrapper/components/FoldingLine";
import { isListItemElement } from "plugins/list/utils";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes, children, element } = props;
  const { activeId } = useDndState();

  const editor = useSlateStatic();
  const id = element.id!;
  const selected = useSelected();

  const hidden = ExtendedEditor.isFoldedChild(element);

  const isInViewport = useWrapperIntersectionObserver(
    attributes.ref,
    activeId != null,
    [hidden]
  );

  const sortableEnabled =
    !hidden && (selected || isInViewport || activeId === element.id);

  const handleFold = useCallback(() => {
    foldElement(editor, element);
  }, [editor, element]);

  const itemProps: ItemProps = {
    element: element,
    elementRef: attributes.ref,
    selected: selected,
    hidden: hidden,
    onFold: handleFold,
    isInViewport: isInViewport,
  };

  return (
    <div {...attributes} style={{ position: "relative" }}>
      <FoldingLine element={element} onFold={handleFold} />
      {sortableEnabled ? (
        <Sortable id={id} {...itemProps}>
          {children}
        </Sortable>
      ) : (
        <Item {...itemProps}>{children}</Item>
      )}
    </div>
  );
};

const Sortable = ({
  id,
  ...props
}: {
  id: string;
} & React.PropsWithChildren<ItemProps>) => {
  const {
    transition,
    transform,
    listeners,
    isDragging,
    isSorting,
    setNodeRef,
  } = useSortable({
    id,
    transition: {
      duration: 350,
      easing: "ease",
    },
  });

  useIsomorphicLayoutEffect(() => {
    props.elementRef && setNodeRef(props.elementRef.current);
  });

  return (
    <Item
      {...props}
      transition={transition}
      transform={transform}
      listeners={listeners}
      isDragging={isDragging}
      isSorting={isSorting}
    />
  );
};

type SortableAttributes = ReturnType<typeof useSortable>["attributes"];

type ItemProps = {
  element: Element;
  elementRef?: React.RefObject<HTMLDivElement>;

  selected?: boolean;
  onFold?: React.MouseEventHandler;
  isDragOverlay?: boolean;
  isInViewport?: boolean;
  hidden?: boolean;
  attributes?: SortableAttributes;

  // sortable props
  transition?: string | null;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
  isSorting?: boolean;
};

const ItemComponent = (props: React.PropsWithChildren<ItemProps>) => {
  const {
    element,
    children,
    transition,
    transform,
    listeners,
    isDragging = false,
    isSorting = false,
    selected = false,
    onFold,
    isDragOverlay = false,
    isInViewport = false,
    hidden = false,
    attributes,
  } = props;

  return (
    <div
      {...attributes}
      className={cn("wrapper", {
        dragging: isDragging,
        selected: selected,
        dragOverlay: isDragOverlay,
        disableSelection: isIOS && isSorting,
        disableInteraction: isSorting,
        hidden: hidden,
        // indicator: isDragging,
      })}
      style={
        {
          transition,
          "--spacing": isListItemElement(element)
            ? `${22 * element.depth}px`
            : 0,
          "--translate-x": transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          "--translate-y": transform
            ? `${Math.round(transform.y)}px`
            : undefined,
        } as React.CSSProperties
      }
    >
      <DragHandle listeners={listeners} />
      <FoldingArrow element={element} onFold={onFold} />
      {children}
    </div>
  );
};

export const Item = memo(ItemComponent, (prev, next) => {
  for (const key of [...Object.keys(prev), ...Object.keys(next)]) {
    if (key === "children") {
      continue;
    }

    // @ts-ignore
    if (prev[key] !== next[key]) {
      return false;
    }
  }

  return true;
});

export default Wrapper;
