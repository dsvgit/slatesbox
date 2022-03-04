import { Editor, Transforms, Element } from "slate";

export const toggleElement = (editor: Editor, type: Element["type"]) => {
  Transforms.setNodes(editor, { type });
};
