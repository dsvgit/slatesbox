import { Element } from "slate";

import { Heading1Type, Heading2Type } from "plugins/heading/types";
import { ParagraphType } from "plugins/paragraph/types";
import { buildSemanticTree, SemanticNode } from "plugins/folding/utils";

const definitions: [Element[], SemanticNode[]][] = [
  [
    [
      {
        type: Heading1Type,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
    ],
    [
      {
        index: 0,
        element: {
          type: Heading1Type,
          children: [],
        },
        children: [
          {
            index: 1,
            element: {
              type: ParagraphType,
              children: [],
            },
            children: [],
          },
        ],
      },
    ],
  ],
  [
    [
      {
        type: Heading1Type,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading2Type,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading1Type,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
      {
        type: Heading2Type,
        children: [],
      },
      {
        type: ParagraphType,
        children: [],
      },
    ],
    [
      {
        index: 0,
        element: {
          type: Heading1Type,
          children: [],
        },
        children: [
          {
            index: 1,
            element: {
              type: ParagraphType,
              children: [],
            },
            children: [],
          },
          {
            index: 2,
            element: {
              type: Heading2Type,
              children: [],
            },
            children: [
              {
                index: 3,
                element: {
                  type: ParagraphType,
                  children: [],
                },
                children: [],
              },
            ],
          },
        ],
      },
      {
        index: 4,
        element: {
          type: Heading1Type,
          children: [],
        },
        children: [
          {
            index: 5,
            element: {
              type: ParagraphType,
              children: [],
            },
            children: [],
          },
          {
            index: 6,
            element: {
              type: Heading2Type,
              children: [],
            },
            children: [
              {
                index: 7,
                element: {
                  type: ParagraphType,
                  children: [],
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  ],
];

test("buildSemanticTree", () => {
  for (const definition of definitions) {
    expect(buildSemanticTree(definition[0])).toEqual(definition[1]);
  }
});
