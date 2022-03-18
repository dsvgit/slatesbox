import { Node, Editor, Element, Transforms } from "slate";
import { Active, Over } from "@dnd-kit/core";

import { ExtendedEditor } from "slate-extended/extendedEditor";

export const moveDndTransform = (
  editor: Editor,
  active: Active,
  over: Over,
  dragDepth: number
) => {
  const activeIndex = active.data.current?.sortable.index;
  let overIndex = over.data.current?.sortable.index;

  const element = editor.children.find((x) => x.id === active.id);

  if (activeIndex < overIndex) {
    const droppableIntervals = ExtendedEditor.getDroppableIntervals(
      editor,
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

  if (
    ExtendedEditor.isNestingElement(editor, element) &&
    element.depth !== dragDepth
  ) {
    updateDndDepth(editor, active.id, dragDepth);
  }
};

export const moveDndElements = (
  editor: Editor,
  activeId: string,
  overIndex: number
) => {
  const element = editor.children.find((x) => x.id === activeId);

  if (!element) {
    return;
  }

  const foldedCount = ExtendedEditor.isFoldingElement(editor, element)
    ? element.foldedCount || 0
    : 0;
  const semanticDescendants = ExtendedEditor.isNestingElement(editor, element)
    ? ExtendedEditor.semanticDescendants(element)
    : ExtendedEditor.semanticDescendants(element)?.slice(0, foldedCount);

  const match = (node: Node) =>
    node === element ||
    (Element.isElement(node) &&
      semanticDescendants.some((x) => x.element.id === node.id));

  Transforms.moveNodes(editor, {
    at: [],
    match,
    to: [overIndex],
  });
};

export const updateDndDepth = (
  editor: Editor,
  activeId: string,
  dragDepth: number = 0
) => {
  Editor.withoutNormalizing(editor, () => {
    const element = editor.children.find((x) => x.id === activeId);

    if (ExtendedEditor.isNestingElement(editor, element)) {
      const foldedCount = ExtendedEditor.isFoldingElement(editor, element)
        ? element.foldedCount || 0
        : 0;
      const semanticDescendants = ExtendedEditor.isNestingElement(
        editor,
        element
      )
        ? ExtendedEditor.semanticDescendants(element)
        : ExtendedEditor.semanticDescendants(element)?.slice(0, foldedCount);

      const depthDiff = element.depth - dragDepth;

      const match = (node: Node) =>
        node === element ||
        (Element.isElement(node) &&
          semanticDescendants.some((x) => x.element.id === node.id));

      const entries = Editor.nodes(editor, { at: [], match });

      for (let [node] of entries) {
        if (ExtendedEditor.isNestingElement(editor, node)) {
          Transforms.setNodes(
            editor,
            {
              depth: node.depth - depthDiff,
            },
            {
              at: [],
              match: (_node) => _node === node,
            }
          );
        }
      }
    }
  });
};
