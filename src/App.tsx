import React, { useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

import { withImage } from "plugins/image/withImage";
import { buildSemanticTree } from "plugins/folding/utils";
import { EditorStateProvider } from "hooks/useEditorState";
import initialValue from "initialValue";
import DndPluginContext from "plugins/dnd/DndPluginContext";
import useRenderElement from "hooks/useRenderElement";

const App = () => {
  // const editor = useMemo(() => withReact(createEditor()), []);
  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = withImage(withHistory(withReact(createEditor())));
  }
  const editor = editorRef.current;

  const [value, setValue] = useState<Descendant[]>(initialValue);

  return (
    <main className="app">
      <Slate editor={editor} value={value} onChange={setValue}>
        <SlateContent />
      </Slate>
    </main>
  );
};

const SlateContent = () => {
  const editor = useSlate();

  const semanticTree = useMemo(
    () => buildSemanticTree(editor.children),
    [editor.children]
  );

  const renderElement = useRenderElement(editor);

  return (
    <DndPluginContext editor={editor}>
      <EditorStateProvider
        value={{
          semanticTree,
        }}
      >
        <Editable className="editable" renderElement={renderElement} />
      </EditorStateProvider>
    </DndPluginContext>
  );
};

export default App;
