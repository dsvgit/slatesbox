import { Editor, Range, Transforms, Path, Element } from "slate";

import { ExtendedEditor } from "slate-extended/extendedEditor";
import { isFoldingElement } from "slate-extended/utils";
import { ParagraphElement, ParagraphType } from "plugins/paragraph/types";
import { ListItemElement, ListItemType, ListTypes } from "plugins/list/types";
import { isListItemElement } from "plugins/list/utils";

export const withExtended = <T extends Editor>(editor: T) => {
  const e = editor as T & ExtendedEditor;

  const { insertBreak, deleteBackward, apply } = e;

  e.deleteBackward = (unit) => {
    if (editor.selection) {
      const path = Editor.path(editor, editor.selection, { depth: 1 });
      const atStart = Range.includes(
        editor.selection,
        Editor.start(editor, path)
      );

      if (atStart && Path.hasPrevious(path)) {
        const prevEntry = Editor.previous(editor, { at: path })!;

        const node = prevEntry[0] as Element;
        const { hidden, folded } = ExtendedEditor.semanticNode(node);

        if (hidden && folded) {
          Transforms.select(editor, Editor.end(editor, [folded.index]));
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  e.insertBreak = () => {
    const [entry] = Editor.nodes(editor, {
      match: (node, path) =>
        path.length === 1 &&
        isFoldingElement(node) &&
        !!editor.selection &&
        Range.includes(editor.selection, Editor.end(editor, path)),
    });

    if (entry) {
      const [node, path] = entry;

      if (isFoldingElement(node) && node.folded) {
        const last = path[path.length - 1];
        const skipCount = node.foldedCount || 0;
        const at = path.slice(0, -1).concat(last + skipCount + 1);

        const newNode = isListItemElement(node)
          ? getEmptyListItem({ depth: node.depth })
          : getEmptyParagraph();

        Transforms.insertNodes(editor, newNode, {
          at,
        });
        Transforms.select(editor, Editor.end(editor, at));
        return;
      }
    }

    insertBreak();
  };

  return e;
};

const getEmptyParagraph = (): ParagraphElement => {
  return {
    type: ParagraphType,
    children: [
      {
        text: "",
      },
    ],
  };
};

const getEmptyListItem = (
  listItem: Partial<ListItemElement>
): ListItemElement => {
  return {
    type: ListItemType,
    children: [
      {
        text: "",
      },
    ],
    listType: listItem.listType ?? ListTypes.Bulleted,
    checked: false,
    depth: listItem.depth ?? 0,
  };
};
