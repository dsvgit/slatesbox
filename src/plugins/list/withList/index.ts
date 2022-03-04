import { Editor } from "slate";

import makeDeleteBackward from "./makeDeleteBackward";
import makeInsertBreak from "./makeInsertBreak";

const withList = (editor: Editor) => {
  editor.insertBreak = makeInsertBreak(editor);
  editor.deleteBackward = makeDeleteBackward(editor);

  return editor;
};

export default withList;
