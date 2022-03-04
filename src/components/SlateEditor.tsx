import React, { useCallback, useRef, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

import { withImage } from "plugins/image/withImage";
import initialValue from "initialValue";
import DndPluginContext from "slate-extended/dnd/DndPluginContext";
import useRenderElement from "hooks/useRenderElement";
import { withDivider } from "plugins/divider/withDivider";
import { withNodeId } from "plugins/nodeId/withNodeId";
import * as listHandlers from "plugins/list/handlers";
import * as softBreakHandlers from "plugins/softBreak/handlers";
import withList from "plugins/list/withList";
import EditorToolbar from "components/EditorToolbar";
import SlateExtended from "slate-extended/SlateExtended";
import { compareLevels } from "slate-extended/utils";

const SlateEditor = () => {
  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = withNodeId(
      withList(withDivider(withImage(withHistory(withReact(createEditor())))))
    );
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

  const renderElement = useRenderElement(editor);

  return (
    <SlateExtended compareLevels={compareLevels}>
      <DndPluginContext editor={editor}>
        <Editable
          className="editable"
          renderElement={renderElement}
          onKeyDown={useCallback((e) => {
            listHandlers.onKeyDown(editor)(e);
            softBreakHandlers.onKeyDown(editor)(e);
          }, [])}
        />
      </DndPluginContext>
    </SlateExtended>
  );
};

export default SlateEditor;
