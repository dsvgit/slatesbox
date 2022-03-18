import { Editor } from "slate";

import { isHeadingElement } from "plugins/heading/utils";

const withHeading = (editor: Editor) => {
  const { isFoldingElement } = editor;

  editor.isFoldingElement = (element) => {
    return isHeadingElement(element) || isFoldingElement(element);
  };

  return editor;
};

export default withHeading;
