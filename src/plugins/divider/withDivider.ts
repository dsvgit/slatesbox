import { Editor, Element } from "slate";

import { isDividerElement } from "./utils";

export const withDivider = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element: Element) =>
    isDividerElement(element) ? true : isVoid(element);

  return editor;
};
