import {BaseEditor, Descendant, Element} from "slate";

import {SemanticNode} from "slate-extended/types";
import {ELEMENT_TO_SEMANTIC_PATH} from "slate-extended/weakMaps";
import {crawlChildren, isFoldingElement} from "slate-extended/utils";

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
      path.push({ element, children: [], index });

      setPath && setPath(element, [...path]);

      const last = path[path.length - 1];
      const parent = path[path.length - 2];
      const children = parent ? parent.children : tree;

      children.push(last);

      index++;
    }

    return tree;
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

    const result: SemanticNode[] = [];

    crawlChildren(semanticNode.children, (node) => {
      result.push(node);
    });

    return result;
  },

  isFoldedChild(element: Element): boolean {
    const path = ExtendedEditor.semanticPath(element);

    const result = path.some(
      (node) =>
        isFoldingElement(node.element) &&
        node.element !== element &&
        node.element.folded
    );

    return result;
  },
};

