import React from "react";
import { Editor } from "slate";
import isHotkey from "is-hotkey";

import { getPreviousListItem } from "plugins/list/queries";
import { moveItemsBack, moveItemsForward } from "plugins/list/transforms";
import { ExtendedEditor } from "slate-extended/extendedEditor";

export const onKeyDown = (editor: Editor) => (e: React.KeyboardEvent) => {
  if (isHotkey(["tab"], e)) {
    e.preventDefault();

    const entries = Array.from(
      Editor.nodes(editor, {
        match: ExtendedEditor.isNestingElementCurried(editor),
      })
    );

    const [firstEntry] = entries;
    if (firstEntry) {
      const prevEntry = getPreviousListItem(editor, firstEntry);

      if (prevEntry) {
        const [prevNode] = prevEntry;
        for (const entry of entries) {
          moveItemsForward(editor, entry, prevNode.depth + 1);
        }
      }
    }
  }

  if (isHotkey(["shift+tab"], e)) {
    e.preventDefault();
    const entries = Editor.nodes(editor, {
      match: ExtendedEditor.isNestingElementCurried(editor),
    });
    for (const entry of entries) {
      moveItemsBack(editor, entry);
    }
  }
};
