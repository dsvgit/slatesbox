import {
  Transforms,
  Path,
  Editor,
  Range,
  Location,
  Node,
  NodeEntry,
} from "slate";

import { isParagraphElement } from "plugins/paragraph/utils";
import { ParagraphType } from "plugins/paragraph/types";

const isTrailingLine = (node: Node) => {
  return isParagraphElement(node) && Node.string(node) === "";
};

const insertTrailingLine = (editor: Editor, at: Location) => {
  Transforms.insertNodes(
    editor,
    {
      type: ParagraphType,
      children: [{ text: "" }],
    } as any,
    { at }
  );
};

export const withTrailingLine = (editor: any) => {
  const { insertBreak, normalizeNode } = editor;

  editor.insertBreak = () => {
    if (editor.selection == null) {
      return;
    }

    insertBreak();

    // if there is only one child there is no sense to remove it
    if (editor.children.length > 1) {
      // get last node and last path
      const lastPath = [editor.children.length - 1];
      const [lastNode] = Editor.node(editor, lastPath);

      // check if cursor is before trailing line
      const isCursorBeforeTrailingLine = Range.includes(
        editor.selection,
        Editor.end(editor, Path.previous(lastPath))
      );

      if (isTrailingLine(lastNode) && isCursorBeforeTrailingLine) {
        // remove trailing line before insert break, on order to keep only one trailing line
        Transforms.removeNodes(editor, { at: lastPath });
      }
    }
  };

  editor.normalizeNode = ([node, path]: NodeEntry) => {
    if (Path.equals(path, [])) {
      if (editor.children.length > 0) {
        const lastPath = [editor.children.length - 1];
        const [lastNode] = Editor.node(editor, lastPath);

        if (!isTrailingLine(lastNode)) {
          // insert trailing line if the last one is not a trailing line
          insertTrailingLine(editor, Path.next(lastPath));
        }
      } else {
        // if  no children insert trailing line
        insertTrailingLine(editor, [0]);
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};
