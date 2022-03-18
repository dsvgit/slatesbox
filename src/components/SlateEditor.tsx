import React, { Fragment, useCallback, useRef, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

import { withImage } from "plugins/image/withImage";
import DndPluginContext from "slate-extended/dnd/DndPluginContext";
import useRenderElement from "hooks/useRenderElement";
import { withDivider } from "plugins/divider/withDivider";
import { withNodeId } from "plugins/nodeId/withNodeId";
import * as listHandlers from "plugins/list/handlers";
import * as softBreakHandlers from "plugins/softBreak/handlers";
import * as markHandlers from "plugins/marks/handlers";
import withList from "plugins/list/withList";
import EditorToolbar from "components/EditorToolbar";
import SlateExtended from "slate-extended/SlateExtended";
import Card from "components/Card";
import { EditableProps } from "slate-react/dist/components/editable";
import { withExtended } from "slate-extended/withExtended";
import { composePlugins } from "utils";
import { withAutoformat } from "plugins/autoformat/withAutoformat";
import { autoformatRules } from "plugins/autoformat/autoformatRules";
import { withResetType } from "plugins/resetType/withResetType";
import { withDeserialize } from "plugins/serialization/withDeserialize";
import { renderLeaf } from "plugins/marks/renderLeaf";
import { withLink } from "plugins/link/withLink";
import { withSerialize } from "plugins/serialization/withSerialize";
import { compareLevels } from "components/utils";
import withHeading from "plugins/heading/withHeading";
import DragOverlayContent from "plugins/wrapper/components/DragOverlayContent";

type Props = {
  initialValue: Descendant[];
  readOnly?: boolean;
  renderElement?: EditableProps["renderElement"];
};

const SlateEditor = (props: Props) => {
  const { initialValue, readOnly = false, renderElement } = props;

  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = composePlugins(
      [
        withResetType,
        withAutoformat(autoformatRules),
        withList,
        withDivider,
        withHeading,
        withLink,
        withImage,
        withSerialize,
        withDeserialize,
        withExtended({
          compareLevels,
        }),
        withNodeId,
        withHistory,
        withReact,
      ],
      createEditor()
    );
  }

  const editor = editorRef.current;
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const [, forceRerender] = useState(0);

  const onKeyDown: React.KeyboardEventHandler = useCallback((e) => {
    listHandlers.onKeyDown(editor)(e);
    softBreakHandlers.onKeyDown(editor)(e);
    markHandlers.onKeyDown(editor)(e);

    forceRerender((x) => x + 1); // after dnd ends then ReactEditor.focus call, to continue typing
  }, []);

  const renderedEditor = (
    <SlateEditable
      readOnly={readOnly}
      onKeyDown={onKeyDown}
      renderElement={renderElement}
    />
  );

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <SlateExtended>
        <DndPluginContext
          onDragEnd={() => {
            forceRerender((x) => x + 1); // after dnd ends to provide the right DragOverlay drop animation
          }}
          editor={editor}
          renderDragOverlay={(props) => <DragOverlayContent {...props} />}
        >
          {readOnly ? (
            renderedEditor
          ) : (
            <Fragment>
              <EditorToolbar />
              <Card>{renderedEditor}</Card>
            </Fragment>
          )}
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
        renderElement={props.renderElement || renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={props.onKeyDown}
      />
      {/*<pre style={{ position: "absolute", fontSize: 13, top: 0, right: 100 }}>*/}
      {/*  {JSON.stringify(editor?.selection, null, 2)}*/}
      {/*</pre>*/}
    </Fragment>
  );
};

export default SlateEditor;
