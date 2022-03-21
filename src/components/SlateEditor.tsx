import React, { useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable } from "slate-react";

import DndPluginContext from "slate-extended/dnd/DndPluginContext";
import useRenderElement from "components/hooks/useRenderElement";
import SlateExtended from "slate-extended/SlateExtended";
import DragOverlayContent from "plugins/wrapper/components/DragOverlayContent";
import usePersistedState from "hooks/usePersistedState";
import usePlugins from "components/hooks/usePlugins";
import useEditor from "components/hooks/useEditor";
import useHandlers from "components/hooks/useHandlers";
import useRenderLeaf from "components/hooks/useRenderLeaf";
import EditorToolbar from "components/EditorToolbar";
import Card from "components/Card";

type Props = {
  id: string;
  initialValue: Descendant[];
  readOnly?: boolean;
};

const SlateEditor = (props: Props) => {
  const { id, initialValue, readOnly = false } = props;

  const [, forceRerender] = useState(0);

  const plugins = usePlugins();
  const editor = useEditor(createEditor, plugins);
  const handlers = useHandlers(editor, [
    ...plugins,
    {
      handlers: {
        onKeyDown: () => () => {
          forceRerender((x) => x + 1); // after dnd ends then ReactEditor.focus call, to continue typing
        },
      },
    },
  ]);

  const renderElement = useRenderElement(editor, plugins);
  const renderLeaf = useRenderLeaf(editor, plugins);

  const [value, setValue] = usePersistedState<Descendant[]>(
    `${id}_content`,
    (restored) => (readOnly ? initialValue : restored ?? initialValue)
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
          <EditorToolbar />
          <Card>
            <Editable
              className="editable"
              {...handlers}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
            />
          </Card>
        </DndPluginContext>
      </SlateExtended>
    </Slate>
  );
};

export default SlateEditor;
