import { Editor } from "slate";

import makeDeleteBackward from "./makeDeleteBackward";
import makeInsertBreak from "./makeInsertBreak";
import makeInsertFragment from "plugins/list/withList/makeInsertFragment";
import { isListItemElement } from "plugins/list/utils";

const withList = (editor: Editor) => {
  editor.insertBreak = makeInsertBreak(editor);
  editor.deleteBackward = makeDeleteBackward(editor);
  editor.insertFragment = makeInsertFragment(editor);

  const { isNestingElement, isFoldingElement } = editor;

  editor.isNestingElement = (element) => {
    return isListItemElement(element) || isNestingElement(element);
  };

  editor.isFoldingElement = (element) => {
    return isListItemElement(element) || isFoldingElement(element);
  };

  return editor;
};

export default withList;
