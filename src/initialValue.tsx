import { Descendant } from "slate";
import { ListTypes } from "plugins/list/types";
import { assignIdRecursively } from "plugins/nodeId/withNodeId";

const clone = (x: object) => JSON.parse(JSON.stringify(x));

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
    folded: false,
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
    folded: false,
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
    folded: false,
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
  {
    type: "hr",
    children: [{ text: "" }],
  },
];

const simpleValue: Descendant[] = [
  {
    type: "h1",
    children: [{ text: "First item" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 1",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 2",
      },
    ],
  },
  {
    type: "h3",
    children: [{ text: "Second item" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 1",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 2",
      },
    ],
  },
  {
    type: "h3",
    children: [{ text: "Second item" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 1",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 2",
      },
    ],
  },
  {
    type: "h1",
    children: [{ text: "Second item" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 1",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 2",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Second item" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 1",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 2",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Second item" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 1",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 2",
      },
    ],
  },
  {
    type: "h1",
    children: [{ text: "Second item" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 1",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Paragraph 2",
      },
    ],
  },
];

const listValue: Descendant[] = [
  {
    type: "h1",
    children: [{ text: "Today" }],
  },
  {
    type: "list_item",
    listType: ListTypes.Bulleted,
    depth: 0,
    children: [{ text: "Morning" }],
  },
  {
    type: "list_item",
    listType: ListTypes.Bulleted,
    depth: 1,
    children: [{ text: "Feed cat" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Rinse bowl" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Open cat food" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Mix dry and wet food in bowl" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Deliver on a silver platter to Pixel" }],
  },
  {
    type: "list_item",
    listType: ListTypes.Bulleted,
    depth: 0,
    children: [{ text: "Afternoon" }],
  },
  {
    type: "list_item",
    listType: ListTypes.Bulleted,
    depth: 1,
    folded: true,
    foldedCount: 3,
    children: [{ text: "Wash car" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Vacuum interior" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Wash exterior" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Wax exterior" }],
  },
  {
    type: "list_item",
    listType: ListTypes.Bulleted,
    depth: 1,
    children: [{ text: "Grocery shopping" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Plan meals" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Clean out fridge" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Make list" }],
  },
  {
    type: "list_item",
    listType: ListTypes.TodoList,
    depth: 2,
    checked: false,
    children: [{ text: "Go to store" }],
  },
  {
    type: "p",
    children: [{ text: "" }],
  },
];

const pValue: Descendant[] = [
  {
    type: "p",
    children: [{ text: "First item" }],
  },
  {
    type: "p",
    children: [{ text: "Second item" }],
  },
  {
    type: "p",
    children: [{ text: "Third item" }],
  },
];

const sValue: Descendant[] = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

const data: Descendant[] = [...listValue];

data.forEach(assignIdRecursively);

export default data;
