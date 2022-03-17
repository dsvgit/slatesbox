import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Descendant, Element } from "slate";
import {
  AutoScrollActivator,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  TraversalOrder,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DragStartEvent } from "@dnd-kit/core/dist/types";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { createPortal } from "react-dom";

import { renderElementContent } from "hooks/useRenderElement";
import { DndStateProvider } from "hooks/useDndState";
import { sortableCollisionDetection } from "slate-extended/dnd/sortableCollisionDetection";
import {
  moveDndDepth,
  moveDndElements,
} from "slate-extended/transforms/moveDndElements";
import { Item } from "plugins/wrapper/components/Item";
import { isListItemElement } from "plugins/list/utils";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { getDepth } from "slate-extended/dnd/utils";

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

type DndPluginContextProps = {
  editor: Editor;
  onDragStart?(event: DragStartEvent): void;
  onDragEnd?(event: DragEndEvent): void;
};

const DndPluginContext = ({
  editor,
  onDragStart,
  onDragEnd,
  children,
}: React.PropsWithChildren<DndPluginContextProps>) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState<number>(0);
  const activeElement = editor.children.find(
    (x) => Element.isElement(x) && x.id === activeId
  );

  const offsetDepth = Math.round(offsetLeft / 50);
  const dragDepth = useMemo(
    () =>
      overId && isListItemElement(activeElement)
        ? getDepth(
            editor.children as Element[],
            activeElement,
            overId,
            offsetDepth
          )
        : 0,
    [editor.children, overId, activeElement, offsetDepth]
  );

  const items = useMemo(
    () =>
      editor.children
        .map((item) => (Element.isElement(item) ? item.id : undefined))
        .filter(Boolean) as string[],
    [editor.children]
  );

  const clearSelection = () => {
    ReactEditor.blur(editor);
    Transforms.deselect(editor);
    window.getSelection()?.empty();
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 0.5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    clearSelection();
    onDragStart && onDragStart(event);

    const { active } = event;

    if (!active) {
      return;
    }

    document.body.classList.add("dragging");

    setActiveId(active.id);
    setOverId(active.id);
  }, []);

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      onDragEnd && onDragEnd(event);
      const { active, over } = event;

      if (over) {
        const activeIndex = active.data.current?.sortable.index;
        let overIndex = over.data.current?.sortable.index;

        const element = editor.children.find(
          (x) => Element.isElement(x) && x.id === active.id
        ) as Element;

        if (activeIndex < overIndex) {
          const droppableIntervals = ExtendedEditor.getDroppableIntervals(
            editor.semanticChildren,
            editor.children.length
          );
          const droppableEnds = new Set(droppableIntervals.map((x) => x[1]));

          // adjust over index in case it is outside droppable elements
          for (const end of droppableEnds) {
            if (overIndex <= end) {
              overIndex = end;
              break;
            }
          }
        }

        if (active.id !== over.id) {
          moveDndElements(editor, active.id, overIndex);
        }

        if (isListItemElement(element) && element.depth !== dragDepth) {
          moveDndDepth(editor, active.id, dragDepth);
        }
      }

      const selectIndex = editor.children.findIndex(
        (x) => Element.isElement(x) && x.id === active.id
      );
      ReactEditor.focus(editor);
      Transforms.select(editor, Editor.end(editor, [selectIndex]));

      resetState();
    },
    [editor, dragDepth]
  );

  const handleDragCancel = () => {
    resetState();
  };

  const resetState = () => {
    setActiveId(null);
    setOffsetLeft(0);

    document.body.classList.remove("dragging");
  };

  return (
    <DndStateProvider
      value={useMemo(
        () => ({
          activeId,
          dragDepth,
        }),
        [activeId, dragDepth]
      )}
    >
      <DndContext
        collisionDetection={sortableCollisionDetection}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        measuring={measuring}
        autoScroll={{
          threshold: {
            x: 0.22,
            y: 0.22,
          },
          interval: 5,
          acceleration: 30,
          activator: AutoScrollActivator.Pointer,
          order: TraversalOrder.TreeOrder,
        }}
      >
        <SortableContext strategy={verticalListSortingStrategy} items={items}>
          {children}
        </SortableContext>
        {createPortal(
          <DragOverlay
            adjustScale={false}
            dropAnimation={{
              duration: 220,
              easing: "cubic-bezier(.43,.96,.36,1.13)",
              dragSourceOpacity: 0,
            }}
          >
            {activeId && Element.isElement(activeElement) ? (
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
