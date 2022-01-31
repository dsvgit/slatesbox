import { Editor, Element } from "slate";
import { isImageElement } from "plugins/image/utils";

export const withImage = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element: Element) =>
    isImageElement(element) ? true : isVoid(element);

  return editor;
};
