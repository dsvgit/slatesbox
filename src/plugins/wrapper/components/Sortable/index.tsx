import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";

import { Item, ItemProps } from "plugins/wrapper/components/Item";

export const Sortable = ({
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
