import { Editor } from "slate";

import { patchCopiedClipboardHtml } from "plugins/serialization/withSerialize/patchCopiedClipboardHtml";
import { getClipboardPlainText } from "plugins/serialization/withSerialize/getClipboardPlainText";
import { removeSkippedElements } from "plugins/serialization/withSerialize/removeSkippedElements";

const getClipboardDataHtmlNode = (data: any) => {
  const clipboardNode = document.createElement("div");
  clipboardNode.innerHTML = data.getData("text/html");
  clipboardNode.setAttribute("hidden", "true");
  document.body.appendChild(clipboardNode);

  return clipboardNode;
};

export const withSerialize = (editor: Editor) => {
  const { setFragmentData } = editor;

  editor.setFragmentData = (data) => {
    setFragmentData(data);

    const clipboardNode = getClipboardDataHtmlNode(data);
    removeSkippedElements(clipboardNode);

    const plainText = getClipboardPlainText(clipboardNode);
    data.setData("text/plain", plainText);

    patchCopiedClipboardHtml(clipboardNode);
    data.setData("text/html", clipboardNode.innerHTML);

    document.body.removeChild(clipboardNode);
  };

  return editor;
};
