import React, { Fragment, useCallback, useRef, useState } from "react";
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
import Card from "components/Card";
import { EditableProps } from "slate-react/dist/components/editable";
import { withExtended } from "slate-extended/withExtended";

const SlateEditor = () => {
  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = withNodeId(
      withList(
        withDivider(
          withImage(withExtended(withHistory(withReact(createEditor()))))
        )
      )
    );
  }

  const editor = editorRef.current;
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const [, forceRerender] = useState(0);

  const onKeyDown: React.KeyboardEventHandler = useCallback((e) => {
    listHandlers.onKeyDown(editor)(e);
    softBreakHandlers.onKeyDown(editor)(e);
    forceRerender((x) => x + 1); // after dnd ends then ReactEditor.focus call, to continue typing
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <SlateExtended compareLevels={compareLevels}>
        <DndPluginContext
          onDragEnd={() => {
            forceRerender((x) => x + 1); // after dnd ends to provide the right DragOverlay drop animation
          }}
          editor={editor}
        >
          <EditorToolbar />
          <Card>
            <SlateEditable onKeyDown={onKeyDown} />
          </Card>
        </DndPluginContext>
      </SlateExtended>
    </Slate>
  );
};

const SlateEditable = (props: EditableProps) => {
  const editor = useSlate();

  const renderElement = useRenderElement(editor);

  return (
    <Fragment>
      <Editable
        className="editable"
        renderElement={renderElement}
        onKeyDown={props.onKeyDown}
      />
      {/*<pre style={{ position: "absolute", fontSize: 13, top: 0, right: 100 }}>*/}
      {/*  {JSON.stringify(editor?.selection, null, 2)}*/}
      {/*</pre>*/}
    </Fragment>
  );
};

export default SlateEditor;
