import { Element } from "slate";

import { Heading1Type, Heading2Type } from "plugins/heading/types";
import { ParagraphType } from "plugins/paragraph/types";
import {
  buildSemanticTree,
  getDroppableIntervals,
} from "plugins/folding/utils";

const definitions: [Element[], [number, number][]][] = [
  [
    [
      {
        type: Heading1Type,
        children: [],
        folded: true,
      },
      {
        type: ParagraphType,
        children: [],
      },
    ],
    [[0, 1]],
  ],
  [
    [
      {
        type: Heading1Type,
        children: [],
        folded: true,
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading2Type,
        children: [],
        folded: true,
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading1Type,
        children: [],
        folded: false,
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading2Type,
        children: [],
        folded: true,
      },
      {
        type: ParagraphType,
        children: [],
      },
    ],
    [
      [0, 3],
      [4, 4],
      [5, 5],
      [6, 7],
    ],
  ],
];

test("getDroppableIntervals", () => {
  for (const definition of definitions) {
    expect(
      getDroppableIntervals(
        buildSemanticTree(definition[0]),
        definition[0].length
      )
    ).toEqual(definition[1]);
  }
});
