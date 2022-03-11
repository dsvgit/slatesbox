import { BaseEditor, Descendant, Element } from "slate";

import { SemanticNode } from "slate-extended/types";
import { ELEMENT_TO_SEMANTIC_PATH } from "slate-extended/weakMaps";
import { crawlChildren, isFoldingElement } from "slate-extended/utils";

export interface ExtendedEditor extends BaseEditor {
  compareLevels: (a: Element, b: Element) => number;
  semanticChildren: SemanticNode[];
  getSemanticChildren: (children: Descendant[]) => SemanticNode[];
}

export const ExtendedEditor = {
  getSemanticChildren(
    { compareLevels }: Pick<ExtendedEditor, "compareLevels">,
    children: Descendant[],
    options: { setPath?: (element: Element, path: SemanticNode[]) => void } = {}
  ) {
    const { setPath } = options;

    const tree: SemanticNode[] = [];
    const path: SemanticNode[] = [];
    let index = 0;

    for (const element of children) {
      if (!Element.isElement(element)) {
        continue;
      }

      const edgeIndex = path.findIndex(
        (p) => compareLevels(p.element, element) !== -1
      );

      if (edgeIndex !== -1) {
        path.splice(edgeIndex);
      }

      // calculate hidden
      let hidden = false;
      const folded = [...path]
        .reverse()
        .find((node) => isFoldingElement(node.element) && node.element.folded);
      if (folded) {
        const foldedCount = isFoldingElement(folded.element)
          ? folded.element.foldedCount ?? 0
          : 0;
        hidden = foldedCount >= index - folded.index;
      }

      path.push({
        element,
        children: [],
        index,
        hidden,
        folded,
        descendants: [],
      });

      setPath && setPath(element, [...path]);

      const last = path[path.length - 1];
      const parent = path[path.length - 2];
      const children = parent ? parent.children : tree;
      if (parent) {
        path.slice(0, -1).forEach((x) => {
          x.descendants.push(last);
        });
      }

      children.push(last);

      index++;
    }

    return tree;
  },

  getDroppableIntervals(
    semanticChildren: SemanticNode[],
    contentLength: number
  ): [number, number][] {
    const intervals: [number, number][] = [];
    let lastIndex = 0;
    let skipCount = 0;

    crawlChildren(
      semanticChildren,
      ({ element, children, index, descendants }, context) => {
        if (skipCount > 0) {
          skipCount = skipCount - descendants.length - 1;
          context.skip();
          return;
        }

        if (isFoldingElement(element) && element.folded && children.length) {
          skipCount = element.foldedCount || 0;
        }

        if (index > 0) {
          // finish previous interval
          intervals.push([lastIndex, index - 1]);
        }

        lastIndex = index;
      }
    );

    // finish last interval
    intervals.push([lastIndex, Math.max(contentLength - 1, 0)]);

    return intervals;
  },

  semanticPath(element: Element): SemanticNode[] {
    const path = ELEMENT_TO_SEMANTIC_PATH.get(element);

    if (!path) {
      throw new Error(
        `Cannot resolve a semantic path from Slate element: ${JSON.stringify(
          element
        )}`
      );
    }

    return path;
  },

  semanticNode(element: Element): SemanticNode {
    const path = ExtendedEditor.semanticPath(element);
    return path[path.length - 1];
  },

  semanticDescendants(element: Element): SemanticNode[] {
    const semanticNode = ExtendedEditor.semanticNode(element);
    return semanticNode.descendants;
  },
};
