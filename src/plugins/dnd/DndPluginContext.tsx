import React, { useCallback } from "react";
import { Editor, Transforms } from "slate";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

type DndPluginContextProps = {
  editor: Editor;
};

const DndPluginContext = ({
  editor,
  children,
}: React.PropsWithChildren<DndPluginContextProps>) => {
  const items = editor.children.map((item, index) => index.toString());

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over) {
        const activeIndex = Number(active.id);
        const overIndex = Number(over.id);
        if (activeIndex !== overIndex) {
          Transforms.moveNodes(editor, {
            at: [activeIndex],
            to: [overIndex],
          });
        }
      }
    },
    [editor]
  );

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext strategy={verticalListSortingStrategy} items={items}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default DndPluginContext;
