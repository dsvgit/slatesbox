import { Editor, Transforms, BaseEditor, Element } from "slate";

import { isEmptyNode } from "queries";
import { moveItemsBack } from "../transforms";
import { ParagraphType } from "plugins/paragraph/types";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { NestingElement } from "slate-extended/types";

const makeInsertBreak = (editor: Editor): BaseEditor["insertBreak"] => {
  const { insertBreak } = editor;

  return () => {
    const [entry] = Editor.nodes(editor, {
      match: ExtendedEditor.isNestingElementCurried(editor),
      mode: "lowest",
    });

    if (entry) {
      const [node] = entry;

      if (isEmptyNode(node)) {
        if (node.depth > 0) {
          moveItemsBack(editor, entry);
          return;
        } else {
          // turn list item into paragraph if it is empty
          Transforms.setNodes(editor, { type: ParagraphType });
          // Transforms.unwrapNodes(editor, { match: isListItemElement });
          return;
        }
      }
    }

    insertBreak();
  };
};

export default makeInsertBreak;
