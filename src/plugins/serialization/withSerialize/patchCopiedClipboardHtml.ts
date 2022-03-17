import {
  crawlDOM,
  getListItemProps,
  isDOMListItem,
} from "plugins/serialization/utils";
import {
  getPlainText,
  isDOMElement,
} from "plugins/serialization/withSerialize/utils";
import { ListTypes } from "plugins/list/types";

export const getHtmlTag = (listType: ListTypes) => {
  const tag = listType === ListTypes.Numbered ? "ol" : "ul";
  return tag;
};

export const patchCopiedClipboardHtml = (root: Element) => {
  let acc: Node[][] = [[]];

  crawlDOM(root.childNodes, (node, context) => {
    const depth = (context as any).cursor.depth;

    if (depth !== 1) return;

    if (isDOMListItem(node)) return acc[acc.length - 1].push(node);

    acc[acc.length - 1].length > 0 && acc.push([]);
  });

  acc.forEach((nodes) => {
    const ul = document.createElement("ul");
    root.insertBefore(ul, nodes[0]);

    nodes.forEach((li) => ul.appendChild(li));
  });

  const listNodes = Array.from(root.querySelectorAll("ul, ol"));

  for (const listNode of listNodes) {
    const items = [];
    for (const listItemNode of listNode.childNodes) {
      if (isDOMElement(listItemNode)) {
        const item = getListItemProps(listItemNode);
        items.push({ ...item, text: getPlainText(listItemNode) });
      }
    }

    const tree = listItemsToTree(items); // flatten items to tree

    console.log("tree", items, tree);

    listNode.innerHTML = "";
    createDOMTree(listNode, tree); // tree to DOM tree
  }
};

const getMin = (array: number[]) =>
  array.reduce((acc, x) => Math.min(acc, x), 0);
const getMax = (array: number[]) =>
  array.reduce((acc, x) => Math.max(acc, x), 0);

const createDOMTree = (container: any, data: any) => {
  for (const { text, children } of data.children) {
    const li = document.createElement("li");

    li.innerHTML = text;
    container.appendChild(li);

    if (children && children.length > 0) {
      const list = document.createElement(getHtmlTag(children[0].listType));
      li.appendChild(list);
      createDOMTree(list, { children });
    }
  }
};

export const listItemsToTree = (listItems: any) => {
  const baseDepth = getMin(listItems.map((item: any) => item.depth));
  const maxDepth = getMax(listItems.map((item: any) => item.depth));

  const tree: { children?: any[] } = { children: [] };
  const parents = { [baseDepth - 1]: tree }; // depth-parents map

  for (const item of listItems) {
    const { depth } = item;

    // reset all parents with larger depth
    for (let i = depth + 1; i <= maxDepth; i++) {
      // @ts-ignore
      parents[i] = null;
    }

    if (!parents[depth]) {
      parents[depth] = {};
    }

    let parent;
    // get first available parent
    for (let parentDepth = depth - 1; parent == null; parentDepth--) {
      parent = parents[parentDepth];
    }

    if (parent.children) {
      parent.children.push(item);
    } else {
      parent.children = [item];
    }

    parents[depth] = item;
  }

  return tree;
};
