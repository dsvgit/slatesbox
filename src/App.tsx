import React, { useCallback, useRef, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
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
import { withImage } from "plugins/image/withImage";
import { isImageElement } from "plugins/image/utils";
import Image from "plugins/image/components/Image";

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

  if (isImageElement(props.element)) {
    return <Image {...props} element={props.element} />;
  }

  const element = props.element as ParagraphElement;
  return <Paragraph {...props} element={element} />;
};

const App = () => {
  const initialValue: Descendant[] = [
    {
      type: "h1",
      children: [{ text: "Dragon" }],
    },
    {
      type: "p",
      children: [
        {
          text: "A dragon is a snake-like legendary creature that appears in the folklore of many cultures worldwide. Beliefs about dragons vary considerably through regions, but dragons in western cultures since the High Middle Ages have often been depicted as winged, horned, four-legged, and capable of breathing fire. Dragons in eastern cultures are usually depicted as wingless, four-legged, serpentine creatures with above-average intelligence.",
        },
      ],
    },
    {
      type: "h2",
      folded: true,
      children: [{ text: "Etymology" }],
    },
    {
      type: "img",
      url: "images/dragon.png",
      children: [{ text: "" }],
    },
    {
      type: "p",
      children: [
        {
          text: 'The word dragon entered the English language in the early 13th century from Old French dragon, which in turn comes from Latin: draconem (nominative draco) meaning "huge serpent, dragon", from Ancient Greek δράκων, drákōn (genitive δράκοντος, drákontos) "serpent, giant seafish". The Greek and Latin term referred to any great serpent, not necessarily mythological.',
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          text: 'The Greek word δράκων is most likely derived from the Greek verb δέρκομαι (dérkomai) meaning "I see", the aorist form of which is ἔδρακον (édrakon).',
        },
      ],
    },
    {
      type: "h2",
      folded: true,
      children: [{ text: "Myth origins" }],
    },
    {
      type: "p",
      children: [
        {
          text: "Draconic creatures appear in virtually all cultures around the globe. Nonetheless, scholars dispute where the idea of a dragon originates from and a wide variety of hypotheses have been proposed.",
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          text: "In his book An Instinct for Dragons (2000), anthropologist David E. Jones suggests a hypothesis that humans, like monkeys, have inherited instinctive reactions to snakes, large cats, and birds of prey. He cites a study which found that approximately 39 people in a hundred are afraid of snakes and notes that fear of snakes is especially prominent in children, even in areas where snakes are rare. The earliest attested dragons all resemble snakes or have snakelike attributes.",
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          text: "Jones therefore concludes that dragons appear in nearly all cultures because humans have an innate fear of snakes and other animals that were major predators of humans' primate ancestors.",
        },
      ],
    },
    {
      type: "h2",
      folded: true,
      children: [{ text: "Modern depictions" }],
    },
    {
      type: "p",
      children: [
        {
          text: 'Dragons and dragon motifs are featured in many works of modern literature, particularly within the fantasy genre. As early as the eighteenth century, critical thinkers such as Denis Diderot were already asserting that too much literature had been published on dragons: "There are already in books all too many fabulous stories of dragons".',
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          text: "In Lewis Carroll's classic children's novel Through the Looking-Glass (1872), one of the inset poems describes the Jabberwock, a kind of dragon.",
        },
      ],
    },
    {
      type: "p",
      children: [
        {
          text: "Carroll's illustrator John Tenniel, a famous political cartoonist, humorously showed the Jabberwock with the waistcoat, buck teeth, and myopic eyes of a Victorian university lecturer, such as Carroll himself.",
        },
      ],
    },
  ];

  // const editor = useMemo(() => withReact(createEditor()), []);
  const editorRef = useRef<Editor>();
  if (!editorRef.current) {
    editorRef.current = withImage(withHistory(withReact(createEditor())));
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
