import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Node, Descendant } from "slate";
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DropAnimation,
} from "@dnd-kit/core";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DragStartEvent } from "@dnd-kit/core/dist/types";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { Slate, Editable, withReact } from "slate-react";
import { createPortal } from "react-dom";

import { renderElementContent } from "hooks/useRenderElement";
import { renderWrapperContent } from "plugins/wrapper";

type DndPluginContextProps = {
  editor: Editor;
};

const defaultDropAnimationConfig: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const DndPluginContext = ({
  editor,
  children,
}: React.PropsWithChildren<DndPluginContextProps>) => {
  const overlayEditor = useMemo(() => withReact(createEditor()), []);
  const [activeId, setActiveId] = useState<string | null>("0");
  const activeElement = activeId ? editor.children[Number(activeId)] : null;

  const items = editor.children.map((item, index) => index.toString());

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    if (!active) {
      return;
    }

    setActiveId(active.id);
  }, []);

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
      setActiveId(null);
    },
    [editor]
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext strategy={verticalListSortingStrategy} items={items}>
        {children}
      </SortableContext>
      {createPortal(
        <DragOverlay
          adjustScale={false}
          dropAnimation={{
            duration: 0,
            easing: "none",
            dragSourceOpacity: 0,
          }}
        >
          {activeElement && Editor.isBlock(editor, activeElement)
            ? renderWrapperContent({
                element: activeElement,
                children: <DragOverlayContent element={activeElement} />,
                isDragOverlay: true,
              })
            : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default DndPluginContext;

const DragOverlayContent = ({ element }: { element: Descendant }) => {
  const overlayEditor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    document.body.classList.add("grabbing");

    return () => {
      document.body.classList.remove("grabbing");
    };
  }, []);

  return (
    <div contentEditable={false}>
      <Slate
        editor={overlayEditor}
        value={[JSON.parse(JSON.stringify(element))]}
        onChange={() => {}}
      >
        <Editable
          className="editable"
          renderElement={renderElementContent}
          readOnly={true}
        />
      </Slate>
    </div>
  );
};
