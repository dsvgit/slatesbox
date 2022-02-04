import { CollisionDetection, closestCenter } from "@dnd-kit/core";

const customCollisionDetection = (
  starts: Set<number>,
  ends: Set<number>
): CollisionDetection => {
  return (props) => {
    const droppableContainers = props.droppableContainers.filter(
      (droppableContainer) => {
        const activeId = Number(props.active.id);
        const id = Number(droppableContainer.id);

        if (activeId === id) {
          return true;
        }

        if (activeId > id ? starts.has(id) : ends.has(id)) {
          return true;
        }

        return false;
      }
    );

    return closestCenter({ ...props, droppableContainers });
  };
};

export default customCollisionDetection;
