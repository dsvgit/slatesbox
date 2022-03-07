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
import { DndStateProvider } from "hooks/useDndState";
import { sortableCollisionDetection } from "slate-extended/dnd/sortableCollisionDetection";
import { moveDndElements } from "slate-extended/transforms/moveDndElements";
import { Item } from "plugins/wrapper/components/Item";

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

  const items = useMemo(
    () =>
      editor.children
        .map((item) => (Element.isElement(item) ? item.id : undefined))
        .filter(Boolean) as string[],
    [editor.children]
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    if (!active) {
      return;
    }

    document.body.classList.add("dragging");
    setActiveId(active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over) {
        let overIndex = over.data.current?.sortable.index;
        if (active.id !== over.id) {
          const activeElement = editor.children.find(
            (x) => Element.isElement(x) && x.id === active.id
          )! as Element;

          moveDndElements(editor, activeElement, overIndex);
        }
      }

      document.body.classList.remove("dragging");
      setActiveId(null);
    },
    [editor]
  );

  return (
    <DndStateProvider
      value={useMemo(
        () => ({
          activeId,
        }),
        [activeId]
      )}
    >
      <DndContext
        collisionDetection={sortableCollisionDetection}
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
            {activeId ? (
              <Item
                element={
                  editor.children.find(
                    (x) => Element.isElement(x) && x.id === activeId
                  )! as Element
                }
                isDragOverlay={true}
              >
                <DragOverlayContent
                  element={
                    editor.children.find(
                      (x) => Element.isElement(x) && x.id === activeId
                    )!
                  }
                />
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
  const content = [element];

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
