import { Editor, Element } from "slate";

import {
  isHeading1Element,
  isHeading2Element,
  isHeading3Element,
} from "plugins/heading/utils";
import { ExtendedEditor } from "slate-extended/extendedEditor";

const getSemanticLevel = (element: Element) => {
  if (isHeading1Element(element)) {
    return 1;
  }

  if (isHeading2Element(element)) {
    return 2;
  }

  if (isHeading3Element(element)) {
    return 3;
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

  return Math.sign(getSemanticLevel(a) - getSemanticLevel(b));
};
