import React, { useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable } from "slate-react";

import DndPluginContext from "slate-extended/dnd/DndPluginContext";
import SlateExtended from "slate-extended/SlateExtended";
import usePlugins from "components/hooks/usePlugins";
import useEditor from "components/hooks/useEditor";
import useRenderLeaf from "components/hooks/useRenderLeaf";
import useDragOverlayRenderElement from "components/hooks/useDragOverlayRenderElement";

type Props = {
  initialValue: Descendant[];
};

const DragOverlayEditor = (props: Props) => {
  const [value, setValue] = useState(props.initialValue);

  const plugins = usePlugins();
  const editor = useEditor(createEditor, plugins);

  const renderElement = useDragOverlayRenderElement(editor, plugins);
  const renderLeaf = useRenderLeaf(editor, plugins);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <SlateExtended>
        <DndPluginContext
          editor={editor}
          renderDragOverlay={(props) => <div />}
        >
          <Editable
            className="editable"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            readOnly={true}
          />
        </DndPluginContext>
      </SlateExtended>
    </Slate>
  );
};

export default DragOverlayEditor;
