import { Descendant, Element } from "slate";

import {
  isHeading1Element,
  isHeading2Element,
  isHeading3Element,
  isHeadingElement,
} from "plugins/heading/utils";
import { FoldingElement } from "plugins/folding/types";

export const isFoldingElement = (element: any): element is FoldingElement => {
  return isHeadingElement(element);
};

const getLevel = (element: Element) => {
  if (isHeading1Element(element)) {
    return 1;
  }

  if (isHeading2Element(element)) {
    return 2;
  }

  if (isHeading3Element(element)) {
    return 3;
  }

  return 999;
};

export type SemanticNode = {
  element: Element;
  children: SemanticNode[];
};

const ELEMENT_TO_SEMANTIC_PATH: WeakMap<Element, SemanticNode[]> =
  new WeakMap();

export const buildSemanticTree = (content: Descendant[]) => {
  const tree: SemanticNode[] = [];
  const path: SemanticNode[] = [];

  for (const element of content) {
    if (!Element.isElement(element)) {
      continue;
    }

    const level = getLevel(element);

    const edgeIndex = path.findIndex((p) => getLevel(p.element) >= level);
    if (edgeIndex !== -1) {
      path.splice(edgeIndex);
    }
    path.push({ element, children: [] });

    ELEMENT_TO_SEMANTIC_PATH.set(element, [...path]);

    const last = path[path.length - 1];
    const parent = path[path.length - 2];
    const children = parent ? parent.children : tree;

    children.push(last);
  }

  return tree;
};

export const foldedIndexes = (content: Descendant[]) => {
  const indexes = new Set<number>();
  let index = 0;
  for (const element of content) {
    if (!Element.isElement(element)) {
      continue;
    }

    const semanticPath = ELEMENT_TO_SEMANTIC_PATH.get(element)!;

    if (
      semanticPath.some(
        (node) =>
          isFoldingElement(node.element) &&
          node.element !== element &&
          node.element.folded
      )
    ) {
      indexes.add(index);
    }

    index++;
  }

  return indexes;
};
