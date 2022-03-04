import type {
  CollisionDescriptor,
  CollisionDetection,
  DroppableContainer,
} from "@dnd-kit/core";
import { MutableRefObject } from "react";

declare type DataRef = MutableRefObject<Record<string, any> | undefined>;

export function sortCollisionsAsc(
  { data: { value: a } }: CollisionDescriptor,
  { data: { value: b } }: CollisionDescriptor
) {
  return a - b;
}

export interface PartialDroppableContainer {
  id: string;
  rect: MutableRefObject<PartialRect | null>;
  data: DataRef;
}

export interface PartialRect {
  height: number;
  top: number;
}

export function sortCollisionsByIndex(
  a: PartialDroppableContainer,
  b: PartialDroppableContainer
) {
  return a.data.current?.sortable.index - b.data.current?.sortable.index;
}

export const sortableCollisionDetectionAlgorithm = (
  activeIndex: number,
  { top, bottom }: { top: number; bottom: number },
  containers: PartialDroppableContainer[]
): CollisionDescriptor[] => {
  const collisions: CollisionDescriptor[] = [];

  const firstRect = containers[0].rect.current;
  const lastRect = containers[containers.length - 1].rect.current;

  let index = 0;
  for (const currentContainer of containers.sort(sortCollisionsByIndex)) {
    const { id } = currentContainer;
    const currentRect = currentContainer.rect.current;

    if (currentRect && firstRect && lastRect) {
      const currentCenter = currentRect.top + currentRect.height / 2;

      const prevRect = containers[index - 1]?.rect.current;
      const prevCenter = prevRect
        ? prevRect.top + prevRect.height / 2
        : firstRect.top - 0.5 * firstRect.height;

      const nextRect = containers[index + 1]?.rect.current;
      const nextCenter = nextRect
        ? nextRect.top + nextRect.height / 2
        : lastRect.top + 1.5 * lastRect.height;

      let activeInterval: [number, number];
      let testInterval: [number, number];

      if (index < activeIndex) {
        activeInterval = [top, top];
        testInterval = [prevCenter, currentCenter];
      } else if (index > activeIndex) {
        activeInterval = [bottom, bottom];
        testInterval = [currentCenter, nextCenter];
      } else {
        activeInterval = [top, bottom];
        testInterval = [prevCenter, nextCenter];
      }

      const includes =
        testInterval[0] < activeInterval[0] &&
        testInterval[1] >= activeInterval[1];
      const sign = includes ? -1 : 1; // sign define if active points inside test interval

      const center = (activeInterval[0] + activeInterval[1]) / 2; // not really important

      const value =
        sign *
        Math.min(
          Math.abs(center - testInterval[0]),
          Math.abs(center - testInterval[1])
        );

      collisions.push({
        id,
        data: {
          droppableContainer: currentContainer as DroppableContainer,
          value,
          index,
        },
      });
    }

    index++;
  }

  const result = collisions.sort(sortCollisionsAsc);

  return result;
};

export const sortableCollisionDetection: CollisionDetection = ({
  active,
  collisionRect,
  droppableContainers: containers,
}) => {
  const activeIndex = active.data.current?.sortable.index;
  const { top, height } = collisionRect;

  return sortableCollisionDetectionAlgorithm(
    activeIndex,
    { top, bottom: top + height },
    containers
  );
};
