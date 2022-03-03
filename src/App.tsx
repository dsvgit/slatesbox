import React, { useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

import { withImage } from "plugins/image/withImage";
import {
  buildSemanticTree,
  getDroppableIntervals,
} from "plugins/semantic/utils";
import { EditorStateProvider } from "hooks/useEditorState";
import initialValue from "initialValue";
import DndPluginContext from "plugins/dnd/DndPluginContext";
import useRenderElement from "hooks/useRenderElement";
import { withDivider } from "plugins/divider/withDivider";

const App = () => {
  // const editor = useMemo(() => withReact(createEditor()), []);
  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = withDivider(
      withImage(withHistory(withReact(createEditor())))
    );
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

  const editorState = useMemo(() => {
    const semanticTree = buildSemanticTree(editor.children);
    const droppableIntervals = getDroppableIntervals(
      semanticTree,
      editor.children.length
    );
    const droppableStarts = new Set(droppableIntervals.map((x) => x[0]));
    const droppableEnds = new Set(droppableIntervals.map((x) => x[1]));

    return {
      semanticTree,
      droppableIntervals,
      droppableStarts,
      droppableEnds,
    };
  }, [editor.children]);

  const renderElement = useRenderElement(editor);

  return (
    <EditorStateProvider value={editorState}>
      <DndPluginContext editor={editor}>
        <Editable className="editable" renderElement={renderElement} />
      </DndPluginContext>
    </EditorStateProvider>
  );
};

export default App;
