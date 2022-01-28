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

const getLevel = (element: FoldingElement) => {
  if (isHeading1Element(element)) {
    return 1;
  }

  if (isHeading2Element(element)) {
    return 2;
  }

  if (isHeading3Element(element)) {
    return 3;
  }

  return null;
};

export const foldedIndexes = (content: Descendant[]) => {
  const indexes = new Set();

  let index = 0;
  let path: FoldingElement[] = [];
  for (const element of content) {
    if (isFoldingElement(element)) {
      const level = getLevel(element);

      if (level != null) {
        const edgeIndex = path.findIndex((part) => getLevel(part)! >= level);
        path = edgeIndex === -1 ? path : path.slice(0, edgeIndex);
        path.push(element);
      }
    }

    const folded = path.some((part) => element !== part && part.folded);

    if (folded) {
      indexes.add(index);
    }
    index++;
  }

  return indexes;
};
