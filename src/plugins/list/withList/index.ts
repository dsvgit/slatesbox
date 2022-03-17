import { Editor } from "slate";

import makeDeleteBackward from "./makeDeleteBackward";
import makeInsertBreak from "./makeInsertBreak";
import makeInsertFragment from "plugins/list/withList/makeInsertFragment";

const withList = (editor: Editor) => {
  editor.insertBreak = makeInsertBreak(editor);
  editor.deleteBackward = makeDeleteBackward(editor);
  editor.insertFragment = makeInsertFragment(editor);

  return editor;
};

export default withList;
