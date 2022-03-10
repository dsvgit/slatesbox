import { Node, Editor, Element, Transforms } from "slate";

import { isFoldingElement } from "slate-extended/utils";
import { ExtendedEditor } from "slate-extended/extendedEditor";

export const moveDndElements = (
  editor: Editor,
  element: Element,
  overIndex: number
) => {
  const foldedCount = isFoldingElement(element) ? element.foldedCount : 0;

  const semanticDescendants =
    ExtendedEditor.semanticDescendants(element)?.slice(0, foldedCount) || [];

  const match = (node: Node) =>
    node === element ||
    (isFoldingElement(element) &&
      Boolean(element.folded) &&
      Element.isElement(node) &&
      semanticDescendants.map((x) => x.element).includes(node));

  Transforms.moveNodes(editor, {
    at: [],
    match,
    to: [overIndex],
  });
};
