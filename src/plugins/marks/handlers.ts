import React from "react";
import { Editor, Range, Transforms } from "slate";
import { isKeyHotkey } from "is-hotkey";

export const onKeyDown = (editor: Editor) => (e: React.KeyboardEvent) => {
  const { selection } = editor;

  // Default left/right behavior is unit:'character'.
  // This fails to distinguish between two cursor positions, such as
  // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
  // Here we modify the behavior to unit:'offset'.
  // This lets the user step into and out of the inline without stepping over characters.
  // You may wish to customize this further to only use unit:'offset' in specific cases.
  if (selection && Range.isCollapsed(selection)) {
    const { nativeEvent } = e;
    if (isKeyHotkey("left", nativeEvent)) {
      e.preventDefault();
      Transforms.move(editor, { unit: "offset", reverse: true });
      return;
    }
    if (isKeyHotkey("right", nativeEvent)) {
      e.preventDefault();
      Transforms.move(editor, { unit: "offset" });
      return;
    }
  }
};
