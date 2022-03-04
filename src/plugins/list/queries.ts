import { Editor, NodeEntry } from "slate";

import { isListItemElement } from "plugins/list/utils";

export const getPreviousListItem = (editor: Editor, [node, path]: NodeEntry) => {
  const previousEntry = Editor.previous(editor, {
    at: path,
    match: isListItemElement, // check if it is a list
  });

  return previousEntry;
};

export const getNextListItem = (editor: Editor, [node, path]: NodeEntry) => {
  const nextEntry = Editor.next(editor, {
    at: path,
    match: isListItemElement, // check if it is a list
  });

  return nextEntry;
};
