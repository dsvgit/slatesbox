import { Editor } from "slate";
import { indexBy } from "ramda";
import { deserializeHtml, parseHtmlDocument } from "@udecode/plate-core";

import { plugins } from "./deserializePlugins";

export const withDeserialize = (editor: Editor) => {
  const { insertFragmentData } = editor;

  editor.insertFragmentData = (data) => {
    const result = insertFragmentData(data);

    if (result) {
      return true;
    }

    const html = data.getData("text/html");

    if (!html) {
      return false;
    }

    const document = parseHtmlDocument(html);

    console.log(document);

    const htmlFragment = deserializeHtml(
      {
        ...editor,
        plugins,
        pluginsByKey: indexBy((x) => x.key, plugins),
      },
      {
        element: document.body,
        stripWhitespace: false,
      }
    );

    if (htmlFragment) {
      console.log(htmlFragment);
      editor.insertFragment(htmlFragment);
      return true;
    }

    return false;
  };

  return editor;
};
