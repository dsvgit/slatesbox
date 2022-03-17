import { Editor, Node } from "slate";
import { min, reduce } from "ramda";
import { isListItemElement } from "plugins/list/utils";
import { ListItemElement } from "plugins/list/types";

const getMin = (array: number[]) =>
  reduce<number, number>(min, Infinity, array);

const makeInsertFragment = (editor: Editor) => {
  const { insertFragment } = editor;

  return (fragment: Node[]) => {
    let baseDepth = 0;
    const [entry] = Editor.nodes(editor, { match: isListItemElement });
    if (entry) {
      const [node] = entry;
      baseDepth = node.depth;
    }

    const listItems: ListItemElement[] = [];
    for (const item of fragment) {
      if (!isListItemElement(item)) {
        break;
      }

      listItems.push(item);
    }

    // adjust depth on pasting
    if (listItems.length > 0) {
      const minDepth = getMin(listItems.map((item) => item.depth));

      for (const listItem of listItems) {
        listItem.depth = listItem.depth + baseDepth - minDepth;
      }
    }

    insertFragment(fragment);
  };
};

export default makeInsertFragment;
