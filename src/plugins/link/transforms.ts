import { Editor, Transforms } from "slate";
import { createLinkElement } from "plugins/link/utils";

export const insertLink = (editor: Editor, url: string) => {
  Transforms.insertNodes(editor, createLinkElement({ url, text: url }));
  // move selection offset to continue editing text instead a link
  Transforms.move(editor, { unit: "offset" });
};
