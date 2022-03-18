import React, { useCallback, useMemo, useState } from "react";
import { Editor, Transforms } from "slate";
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
import { ReactEditor } from "slate-react";
import { createPortal } from "react-dom";

import { DndStateProvider } from "hooks/useDndState";
import { sortableCollisionDetection } from "slate-extended/dnd/sortableCollisionDetection";
import { moveDndTransform } from "slate-extended/transforms/moveDndTransform";
import { isListItemElement } from "plugins/list/utils";
import { getDepth } from "slate-extended/dnd/utils";
import DragOverlayContent from "plugins/wrapper/components/DragOverlayContent";
import { ExtendedEditor } from "slate-extended/extendedEditor";

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
  const activeElement = editor.children.find((x) => x.id === activeId) || null;
  const semanticNode = activeElement
    ? ExtendedEditor.semanticNode(activeElement)
    : null;

  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState<number>(0);
  const [_dragOverlayHeight, setDragOverlayHeight] = useState<number | null>(
    null
  );
  const minOverlayHeight = semanticNode
    ? (semanticNode.descendants.filter((x) => !x.hidden).length + 1) * 26
    : 0;
  const dragOverlayHeight =
    _dragOverlayHeight &&
    isListItemElement(activeElement) &&
    !activeElement.folded
      ? Math.max(minOverlayHeight, _dragOverlayHeight)
      : null;

  const offsetDepth = Math.round(offsetLeft / 50);
  const dragDepth = useMemo(
    () =>
      overId && isListItemElement(activeElement)
        ? getDepth(editor.children, activeElement, overId, offsetDepth)
        : 0,
    [editor.children, overId, activeElement, offsetDepth]
  );

  const items = useMemo(
    () => editor.children.map((item) => item.id!).filter(Boolean),
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
        moveDndTransform(editor, active, over, dragDepth);
      }

      const selectIndex = editor.children.findIndex((x) => x.id === active.id);
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
          activeElement,
          dragDepth,
          dragOverlayHeight,
        }),
        [activeId, activeElement, dragDepth, dragOverlayHeight]
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
            {activeId && (
              <DragOverlayContent
                editor={editor}
                activeId={activeId}
                onHeightChange={(height) => setDragOverlayHeight(height)}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </DndStateProvider>
  );
};

export default DndPluginContext;
