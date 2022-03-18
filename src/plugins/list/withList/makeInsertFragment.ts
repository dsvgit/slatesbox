import { Editor, Node } from "slate";

import { NestingElement } from "slate-extended/types";
import { ExtendedEditor } from "slate-extended/extendedEditor";

const getMin = (array: number[]) =>
  array.reduce((acc, x) => Math.min(acc, x), Infinity);

const makeInsertFragment = (editor: Editor) => {
  const { insertFragment } = editor;

  return (fragment: Node[]) => {
    let baseDepth = 0;
    const [entry] = Editor.nodes(editor, {
      match: ExtendedEditor.isNestingElementCurried(editor),
    });
    if (entry) {
      const [node] = entry;
      baseDepth = node.depth;
    }

    const listItems: NestingElement[] = [];
    for (const item of fragment) {
      if (!ExtendedEditor.isNestingElement(editor, item)) {
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
