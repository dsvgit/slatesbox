import React, { useCallback, useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { compose } from "ramda";

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
import { withNodeId } from "plugins/nodeId/withNodeId";
import { onKeyDown } from "plugins/list/handlers";
import withList from "plugins/list/withList";
import EditorToolbar from "components/EditorToolbar";

const SlateEditor = () => {
  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = compose(
      withNodeId,
      withList,
      withDivider,
      withImage,
      withHistory,
      withReact
    )(createEditor());
  }
  const editor = editorRef.current;

  const [value, setValue] = useState<Descendant[]>(initialValue);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <EditorToolbar />
      <SlateContent />
      {/*<pre style={{ position: "absolute", fontSize: 13, top: 0, right: 100 }}>*/}
      {/*  {JSON.stringify(value, null, 2)}*/}
      {/*</pre>*/}
    </Slate>
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
        <Editable
          className="editable"
          renderElement={renderElement}
          onKeyDown={useCallback(onKeyDown(editor), [])}
        />
      </DndPluginContext>
    </EditorStateProvider>
  );
};

export default SlateEditor;
