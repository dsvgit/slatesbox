import { Editor, Element, Node } from "slate";

import {
  isHeading1Element,
  isHeading2Element,
  isHeading3Element,
} from "plugins/heading/utils";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { isParagraphElement } from "plugins/paragraph/utils";

const getSemanticLevel = (editor: Editor, element: Element) => {
  if (
    isParagraphElement(element) &&
    Node.string(element) === "" &&
    editor.children.length > 0 &&
    editor.children[editor.children.length - 1].id === element.id
  ) {
    return 1;
  }

  if (isHeading1Element(element)) {
    return 2;
  }

  if (isHeading2Element(element)) {
    return 3;
  }

  if (isHeading3Element(element)) {
    return 4;
  }

  return Infinity;
};

export const compareLevels = (editor: Editor) => (a: Element, b: Element) => {
  if (
    ExtendedEditor.isNestingElement(editor, a) &&
    ExtendedEditor.isNestingElement(editor, b)
  ) {
    return Math.sign(a.depth - b.depth);
  }

  return Math.sign(getSemanticLevel(editor, a) - getSemanticLevel(editor, b));
};
