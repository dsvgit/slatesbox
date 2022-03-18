import { Editor } from "slate";

type Plugin = (editor: Editor) => Editor;

export const composePlugins = (plugins: Plugin[], _editor: Editor) => {
  let editor = _editor;
  for (const plugin of plugins.reverse()) {
    editor = plugin(editor);
  }

  return editor;
};
