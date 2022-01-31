import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Descendant, Element } from "slate";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
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
import { getSemanticChildren, isFoldingElement } from "plugins/folding/utils";

const clone = (x: object) => JSON.parse(JSON.stringify(x));

type DndPluginContextProps = {
  editor: Editor;
};

const DndPluginContext = ({
  editor,
  children,
}: React.PropsWithChildren<DndPluginContextProps>) => {
  const [activeId, setActiveId] = useState<string | null>(null);
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
          {activeElement && Element.isElement(activeElement)
            ? renderWrapperContent({
                element: activeElement,
                children: (
                  <DragOverlayContent editor={editor} element={activeElement} />
                ),
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

const DragOverlayContent = ({
  editor,
  element,
}: {
  editor: Editor;
  element: Descendant;
}) => {
  const overlayEditor = useMemo(() => withReact(createEditor()), []);
  const semanticChildren = getSemanticChildren(element);
  // const content =
  //   isFoldingElement(element) && element.folded
  //     ? clone([element])
  //     : clone([element, ...semanticChildren]);
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
