import { Element } from "slate";

import { Heading1Type, Heading2Type } from "plugins/heading/types";
import { ParagraphType } from "plugins/paragraph/types";
import { foldedIndexes } from "plugins/folding/utils";

const definitions: [Element[], Set<number>][] = [
  [
    [
      {
        type: Heading1Type,
        folded: true,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
    ],
    new Set([1]),
  ],
  [
    [
      {
        type: Heading1Type,
        folded: false,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading2Type,
        folded: true,
        children: [],
      },
      {
        type: ParagraphType,
        children: [{ text: "12" }],
      },
      {
        type: Heading1Type,
        folded: true,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading2Type,
        folded: false,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
    ],
    new Set([3, 5, 6, 7]),
  ],
];

test("foldedIndexes", () => {
  for (const definition of definitions) {
    expect(foldedIndexes(definition[0])).toEqual(definition[1]);
  }
});
