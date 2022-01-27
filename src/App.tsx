import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  ReactEditor,
  useSlate,
} from "slate-react";
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
import { arrayMove } from "utils";

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

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const reorderChildren = useCallback(
    (from: number, to: number) => {
      editor.children = arrayMove(editor.children, from, to);
      setValue(editor.children);
    },
    [editor]
  );

  return (
    <main className="app">
      <Slate editor={editor} value={value} onChange={setValue}>
        <SlateContent reorderChildren={reorderChildren} />
      </Slate>
    </main>
  );
};

type SlateContentProps = {
  reorderChildren: (from: number, to: number) => void;
};

const SlateContent = ({ reorderChildren }: SlateContentProps) => {
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
            reorderChildren(activeIndex, overIndex);
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
