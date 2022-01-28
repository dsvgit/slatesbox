import { Editor, Element } from "slate";
import { isImageElement } from "plugins/image/utils";

export const withImage = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element: Element) =>
    isVoid(element) || isImageElement(element);

  return editor;
};
