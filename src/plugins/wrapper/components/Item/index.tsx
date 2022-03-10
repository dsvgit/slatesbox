import React, { memo, Fragment } from "react";
import { useSortable } from "@dnd-kit/sortable";
import cn from "classnames";
import { isIOS } from "react-device-detect";
import { isListItemElement } from "plugins/list/utils";
import { Element } from "slate";
import { Transform } from "@dnd-kit/utilities";
import { DraggableSyntheticListeners } from "@dnd-kit/core";

import FoldingArrow from "plugins/wrapper/components/FoldingArrow";
import DragHandle from "plugins/wrapper/components/DragHandle";
import FoldingLine from "plugins/wrapper/components/FoldingLine";

type SortableAttributes = ReturnType<typeof useSortable>["attributes"];
export type ItemProps = {
  element: Element;
  elementRef?: React.RefObject<HTMLDivElement>;

  selected?: boolean;
  onFold?: React.MouseEventHandler;
  isDragOverlay?: boolean;
  isInViewport?: boolean;
  hidden?: boolean;
  attributes?: SortableAttributes;
  dragDepth?: number;

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
    dragDepth = 0,
    attributes,
  } = props;

  return (
    <Fragment>
      <DragHandle listeners={listeners} />
      <div
        {...attributes}
        className={cn("item", {
          dragging: isDragging,
          selected: selected,
          dragOverlay: isDragOverlay,
          disableSelection: isIOS && isSorting,
          disableInteraction: isSorting,
          hidden: hidden,
          "item-list": isListItemElement(element),
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
        <FoldingLine element={element} onFold={onFold} />
        <FoldingArrow element={element} onFold={onFold} />
        {children}
      </div>
    </Fragment>
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