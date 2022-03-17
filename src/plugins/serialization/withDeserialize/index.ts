import { Editor } from "slate";
import { deserializeHtml, parseHtmlDocument } from "@udecode/plate-core";

import { deserializePlugins } from "plugins/serialization/withDeserialize/deserializePlugins";
import { indexBy } from "ramda";
import { patchPastedClipboardHtml } from "plugins/serialization/withDeserialize/patchPastedClipboardHtml";

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

    const document = new DOMParser().parseFromString(html, "text/html");

    patchPastedClipboardHtml(document.body);

    const htmlFragment = deserializeHtml(
      {
        ...editor,
        plugins: deserializePlugins,
        pluginsByKey: indexBy((x) => x.key, deserializePlugins),
      },
      { element: document.body }
    );

    if (htmlFragment) {
      // @ts-ignore
      window.lastFragment = htmlFragment;
      editor.insertFragment(htmlFragment);
      return true;
    }

    return false;
  };

  return editor;
};
