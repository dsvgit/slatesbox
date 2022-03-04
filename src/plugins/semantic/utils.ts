import { crawlChildren, isFoldingElement } from "slate-extended/utils";
import { SemanticNode } from "slate-extended/types";

export const getDroppableIntervals = (
  semanticTree: SemanticNode[],
  contentLength: number
): [number, number][] => {
  const intervals: [number, number][] = [];
  let lastIndex = 0;
  crawlChildren(semanticTree, ({ element, children, index }, context) => {
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
