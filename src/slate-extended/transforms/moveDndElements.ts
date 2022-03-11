import { Node, Editor, Element, Transforms } from "slate";

import { isFoldingElement } from "slate-extended/utils";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { isListItemElement } from "plugins/list/utils";

export const moveDndElements = (
  editor: Editor,
  activeId: string,
  overIndex: number
) => {
  const element = editor.children.find(
    (x) => Element.isElement(x) && x.id === activeId
  ) as Element;

  const foldedCount = isFoldingElement(element) ? element.foldedCount : 0;

  const semanticDescendants =
    ExtendedEditor.semanticDescendants(element)?.slice(0, foldedCount) || [];

  const match = (node: Node) =>
    node === element ||
    (isFoldingElement(element) &&
      Boolean(element.folded) &&
      Element.isElement(node) &&
      semanticDescendants.some((x) => x.element.id === node.id));

  Transforms.moveNodes(editor, {
    at: [],
    match,
    to: [overIndex],
  });
};

export const moveDndDepth = (
  editor: Editor,
  activeId: string,
  dragDepth: number = 0
) => {
  Editor.withoutNormalizing(editor, () => {
    const element = editor.children.find(
      (x) => Element.isElement(x) && x.id === activeId
    ) as Element;

    if (isListItemElement(element)) {
      const foldedCount = isFoldingElement(element) ? element.foldedCount : 0;

      const semanticDescendants =
        ExtendedEditor.semanticDescendants(element)?.slice(0, foldedCount) ||
        [];

      const depthDiff = element.depth - dragDepth;

      const match = (node: Node) =>
        node === element ||
        (isFoldingElement(element) &&
          Boolean(element.folded) &&
          Element.isElement(node) &&
          semanticDescendants.some((x) => x.element.id === node.id));

      const entries = Editor.nodes(editor, { at: [], match });

      for (let [node] of entries) {
        if (isListItemElement(node)) {
          console.log(node.depth, depthDiff);
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
