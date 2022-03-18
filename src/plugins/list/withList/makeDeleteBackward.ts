import { Editor, BaseEditor, Range, Path, Transforms, Node } from "slate";

import { moveItemsBack } from "plugins/list/transforms";
import { isListItemElement } from "plugins/list/utils";
import { ParagraphType } from "plugins/paragraph/types";

const makeDeleteBackward = (editor: Editor): BaseEditor["deleteBackward"] => {
  const { deleteBackward } = editor;

  return (unit) => {
    if (editor.selection) {
      const path = Editor.path(editor, editor.selection, { depth: 1 });
      const [node] = Editor.node(editor, path);
      const atStart = Range.includes(
        editor.selection,
        Editor.start(editor, path)
      );

      const isListItem = isListItemElement(node);
      const previousEntry = Editor.previous(editor, { at: path })!;
      const isPrevListItem =
        Path.hasPrevious(path) && isListItemElement(previousEntry[0]);

      if (atStart) {
        if (isListItem && !isPrevListItem) {
          if (node.depth === 0) {
            Transforms.setNodes(
              editor,
              {
                type: ParagraphType,
              },
              {
                at: path,
              }
            );
          } else {
            moveItemsBack(editor, node, path);
          }
          return;
        }
      }
    }

    deleteBackward(unit);
  };
};

export default makeDeleteBackward;
