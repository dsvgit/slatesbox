import crawl from "tree-crawl";
import { ListTypes } from "plugins/list/types";
import { Element as SlateElement } from "slate";

export const crawlDOM = (
  nodes: Iterable<Node>,
  fn: (node: Node, context: crawl.Context<Node>) => void
) =>
  crawl({ childNodes: nodes } as Node, fn, {
    getChildren: (node) => Array.from(node.childNodes),
  });

export const makeListItemAttributes = ({
  depth,
  listType,
  index = 0,
  checked = false,
}: {
  depth: number;
  listType: ListTypes;
  index?: number;
  checked?: boolean;
}) => {
  return {
    "data-slate-list-item-depth": depth,
    "data-slate-list-item-type": listType,
    "data-slate-list-item-index": index,
    "data-slate-list-item-checked": checked,
  };
};

export const getListItemProps = (domNode: Element) => {
  const depth = Number(domNode.getAttribute("data-slate-list-item-depth"));
  const listType = domNode.getAttribute(
    "data-slate-list-item-type"
  ) as ListTypes;
  const index = Number(domNode.getAttribute("data-slate-list-item-index"));
  const checked =
    domNode.getAttribute("data-slate-list-item-checked") === "true";

  return {
    depth,
    listType,
    index,
    checked,
  };
};

export const isDOMList = (node: Node) =>
  node.nodeType === 1 && (node.nodeName === "UL" || node.nodeName === "OL");
export const isDOMListItem = (node: Node) =>
  node.nodeType === 1 && node.nodeName === "LI";
