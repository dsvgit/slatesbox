import React from "react";
import { useFocused } from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";

import { Item, ItemProps } from "plugins/wrapper/components/Item";

export const Sortable = ({
  id,
  ...props
}: {
  id: string;
} & React.PropsWithChildren<ItemProps>) => {
  const sortable = useSortable({
    id,
    animateLayoutChanges: () => false,
    transition: {
      duration: 350,
      easing: "ease",
    },
  });

  const {
    transition,
    transform,
    listeners,
    isDragging,
    isSorting,
    setNodeRef,
  } = sortable;

  const focused = useFocused();

  useIsomorphicLayoutEffect(() => {
    props.elementRef && setNodeRef(props.elementRef.current);
  });

  return (
    <Item
      {...props}
      transition={focused ? null : transition}
      transform={transform}
      listeners={listeners}
      isDragging={isDragging}
      isSorting={isSorting}
    />
  );
};
