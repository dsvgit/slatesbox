import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Descendant, Element } from "slate";
import {
  AutoScrollActivator,
  DndContext,
  DragEndEvent,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DragStartEvent } from "@dnd-kit/core/dist/types";
import { Slate, Editable, withReact } from "slate-react";
import { createPortal } from "react-dom";

import { renderElementContent } from "hooks/useRenderElement";
import { Item } from "plugins/wrapper";
import { isFoldingElement } from "plugins/folding/utils";
import { getSemanticChildren } from "plugins/semantic/utils";
import { DndStateProvider } from "hooks/useDndState";
import customCollisionDetection from "plugins/dnd/customCollisionDetection";
import { useEditorState } from "hooks/useEditorState";

const clone = (x: object) => JSON.parse(JSON.stringify(x));

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

type DndPluginContextProps = {
  editor: Editor;
};

const DndPluginContext = ({
  editor,
  children,
}: React.PropsWithChildren<DndPluginContextProps>) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeElement = activeId ? editor.children[Number(activeId)] : null;

  const { droppableStarts, droppableEnds } = useEditorState();
  const items = editor.children.map((item, index) => index.toString());

  const collisionDetection = useMemo(
    () => customCollisionDetection(droppableStarts, droppableEnds),
    [droppableStarts, droppableEnds]
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

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
          const activeElement = editor.children[activeIndex];
          const semanticChildren = getSemanticChildren(activeElement);

          Transforms.moveNodes(editor, {
            at: [],
            match: (node) =>
              node === activeElement ||
              (isFoldingElement(activeElement) &&
                Boolean(activeElement.folded) &&
                Element.isElement(node) &&
                semanticChildren.includes(node)),
            to: [overIndex],
          });
        }
      }
      setActiveId(null);
    },
    [editor]
  );

  return (
    <DndStateProvider value={{ activeId }}>
      <DndContext
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
        sensors={sensors}
        measuring={measuring}
        autoScroll={{
          threshold: {
            x: 0.25,
            y: 0.25,
          },
          acceleration: 18,
          activator: AutoScrollActivator.Pointer,
        }}
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
            {activeElement && Element.isElement(activeElement) ? (
              <Item element={activeElement} isDragOverlay={true}>
                <DragOverlayContent element={activeElement} />
              </Item>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </DndStateProvider>
  );
};

export default DndPluginContext;

const DragOverlayContent = ({ element }: { element: Descendant }) => {
  const overlayEditor = useMemo(() => withReact(createEditor()), []);
  const content = clone([element]);

  useEffect(() => {
    document.body.classList.add("grabbing");

    return () => {
      document.body.classList.remove("grabbing");
    };
  }, []);

  return (
    <div contentEditable={false}>
      <Slate editor={overlayEditor} value={content} onChange={() => {}}>
        <Editable
          className="editable"
          renderElement={renderElementContent}
          readOnly={true}
        />
      </Slate>
    </div>
  );
};
