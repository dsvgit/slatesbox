import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  ReactEditor,
} from "slate-react";

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
      type: "h3",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "p",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ];

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

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
    <main className="app">
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable className="editable" renderElement={renderElement} />
      </Slate>
    </main>
  );
};

export default App;
