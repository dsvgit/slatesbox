import { Editor, Transforms, BaseEditor } from "slate";

import { isListItemElement } from "plugins/list/utils";
import { isEmptyNode } from "queries";
import { moveItemsBack } from "plugins/list/transforms";
import { ParagraphType } from "plugins/paragraph/types";

const makeDeleteBackward = (editor: Editor): BaseEditor["deleteBackward"] => {
  const { deleteBackward } = editor;

  return (unit: any) => {
    const [entry] = Editor.nodes(editor, { match: isListItemElement });

    if (entry) {
      const [node, path] = entry;

      if (isEmptyNode(node)) {
        if (node.depth > 0) {
          moveItemsBack(editor, entry);
          return;
        } else {
          // turn list item into paragraph if it is empty
          Transforms.setNodes(editor, { type: ParagraphType });
          return;
        }
      }
    }

    deleteBackward(unit);
  };
};

export default makeDeleteBackward;
