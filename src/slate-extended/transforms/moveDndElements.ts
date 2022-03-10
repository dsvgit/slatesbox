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
      semanticDescendants.map((x) => x.element).includes(node));

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
      semanticDescendants.map((x) => x.element).includes(node));

  Transforms.setNodes(
    editor,
    {
      depth: dragDepth,
    },
    {
      at: [],
      match,
    }
  );
};
