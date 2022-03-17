import { Editor } from "slate";

import { isLinkElement } from "plugins/link/utils";

export const withLink = (editor: Editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return isInline(element) || isLinkElement(element);
  };

  return editor;
};
