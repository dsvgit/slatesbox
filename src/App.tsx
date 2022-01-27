import React, { useCallback, useRef, useState } from "react";
import {createEditor, Descendant, Editor, Transforms} from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  ReactEditor,
  useSlate,
} from "slate-react";
import { withHistory } from "slate-history";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import Paragraph from "plugins/paragraph/components/Paragraph";
import { ParagraphElement } from "plugins/paragraph/types";
import {
  isHeading1Element,
  isHeading2Element,
  isHeading3Element,
} from "plugins/heading/utils";
import {
  Heading1,
  Heading2,
  Heading3,
} from "plugins/heading/components/Heading";
import Wrapper from "plugins/wrapper";
import { ElementProps } from "plugins/types";

const renderElementContent = (props: ElementProps) => {
  if (isHeading1Element(props.element)) {
    return <Heading1 {...props} element={props.element} />;
  }

  if (isHeading2Element(props.element)) {
    return <Heading2 {...props} element={props.element} />;
  }

  if (isHeading3Element(props.element)) {
    return <Heading3 {...props} element={props.element} />;
  }

  const element = props.element as ParagraphElement;
  return <Paragraph {...props} element={element} />;
};

const App = () => {
  const initialValue: Descendant[] = [
    {
      type: "h1",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "p",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "p",
      children: [
        {
          text: "A line of text in a paragraph. A line of text in a paragraph. A line of text in a paragraph. A line of text in a paragraph.",
        },
      ],
    },
    {
      type: "p",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "h2",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "p",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "p",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ];

  // const editor = useMemo(() => withReact(createEditor()), []);
  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = withHistory(withReact(createEditor()));
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

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const { attributes, children, element } = props;

      const path = ReactEditor.findPath(editor, element);

      if (path.length === 1) {
        return (
          <Wrapper attributes={attributes} element={element}>
            {renderElementContent({
              element,
              children,
            })}
          </Wrapper>
        );
      }

      return renderElementContent({
        attributes,
        element,
        children,
      });
    },
    [editor]
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={(result) => {
        const { active, over } = result;

        if (over) {
          const activeIndex = Number(active.id);
          const overIndex = Number(over.id);
          if (activeIndex !== overIndex) {
            Transforms.moveNodes(editor, {
              at: [activeIndex],
              to: [overIndex],
            });
          }
        }
      }}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={editor.children.map((item, index) => index.toString())}
      >
        <Editable className="editable" renderElement={renderElement} />
      </SortableContext>
    </DndContext>
  );
};

export default App;
