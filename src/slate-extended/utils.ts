import { Element } from "slate";
import {
  isHeading1Element,
  isHeading2Element,
  isHeading3Element,
  isHeadingElement,
} from "plugins/heading/utils";
import { isListItemElement } from "plugins/list/utils";
import { FoldingElement } from "slate-extended/types";
import crawl from "tree-crawl";

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

  return Infinity;
};

export const compareLevels = (a: Element, b: Element) => {
  if (isListItemElement(a) && isListItemElement(b)) {
    return Math.sign(a.depth - b.depth);
  }

  return Math.sign(getSemanticLevel(a) - getSemanticLevel(b));
};

export const isFoldingElement = (element: any): element is FoldingElement => {
  return isHeadingElement(element) || isListItemElement(element);
};

export const crawlChildren = <
  T extends {
    children: T[];
  }
>(
  children: T[],
  iteratee: (node: T, context: crawl.Context<T>) => void,
  options: crawl.Options<T> = {}
): void => {
  const root = { children } as T;

  crawl<T>(
    root,
    (node, context) => {
      if (node === root) {
        return;
      }

      iteratee(node, context);
    },
    options
  );
};
