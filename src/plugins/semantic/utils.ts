import {Descendant, Element} from "slate";
import crawl from "tree-crawl";

import {isHeading1Element, isHeading2Element, isHeading3Element,} from "plugins/heading/utils";
import {isFoldingElement} from "plugins/folding/utils";

const getSemanticLevel = (element: Element) => {
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
  index: number;
};

export const ELEMENT_TO_SEMANTIC_PATH: WeakMap<Element, SemanticNode[]> =
  new WeakMap();

export const buildSemanticTree = (content: Descendant[]) => {
  const tree: SemanticNode[] = [];
  const path: SemanticNode[] = [];
  let index = 0;

  for (const element of content) {
    if (!Element.isElement(element)) {
      continue;
    }

    const level = getSemanticLevel(element);

    const edgeIndex = path.findIndex(
      (p) => getSemanticLevel(p.element) >= level
    );
    if (edgeIndex !== -1) {
      path.splice(edgeIndex);
    }
    path.push({ element, children: [], index });

    ELEMENT_TO_SEMANTIC_PATH.set(element, [...path]);

    const last = path[path.length - 1];
    const parent = path[path.length - 2];
    const children = parent ? parent.children : tree;

    children.push(last);
    index++;
  }

  return tree;
};

export const isFoldedChild = (element: Descendant) => {
  if (!Element.isElement(element)) {
    return false;
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
    return true;
  }
};

export const crawlSemanticTree = (
  semanticTree: SemanticNode[],
  fn: (node: SemanticNode, context: crawl.Context<SemanticNode>) => void
) => {
  if (!semanticTree) {
    return;
  }

  crawl<SemanticNode>({ children: semanticTree } as SemanticNode, fn, {});
};

export const getDroppableIntervals = (
  semanticTree: SemanticNode[],
  contentLength: number
): [number, number][] => {
  const intervals: [number, number][] = [];
  let lastIndex = 0;
  crawlSemanticTree(semanticTree, ({ element, children, index }, context) => {
    if (element != null) {
      if (isFoldingElement(element) && element.folded && children.length) {
        context.skip();
      }

      if (index > 0) {
        intervals.push([lastIndex, index - 1]);
      }

      lastIndex = index;
    }
  });

  intervals.push([lastIndex, Math.max(contentLength - 1, 0)]);

  return intervals;
};

export const getSemanticChildren = (element: Descendant | null): Element[] => {
  if (!element || !Element.isElement(element)) {
    return [];
  }

  const semanticPath = ELEMENT_TO_SEMANTIC_PATH.get(element);
  const semanticChildren = semanticPath
    ? semanticPath[semanticPath.length - 1].children
    : [];

  return semanticChildren.map((x) => x.element);
};
