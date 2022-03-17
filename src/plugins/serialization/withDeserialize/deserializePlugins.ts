import { ParagraphType } from "plugins/paragraph/types";
import {
  Heading1Type,
  Heading2Type,
  Heading3Type,
} from "plugins/heading/types";
import { createPluginFactory } from "@udecode/plate-core";
import { nanoid } from "nanoid";
import { PlatePlugin } from "@udecode/plate-core/dist/types/plugins/PlatePlugin";
import { ImageType } from "plugins/image/types";
import { DeserializeHtml } from "@udecode/plate-core/dist/types/plugins/DeserializeHtml";

import { DividerType } from "plugins/divider/types";
import { ListItemType } from "plugins/list/types";
import { BlockquoteType } from "plugins/blockquote/types";
import { getListItemProps } from "plugins/serialization/utils";
import { LinkType } from "plugins/link/types";

const rules: DeserializeHtml[] = [
  {
    isElement: true,
    getNode: () => ({ type: ParagraphType }),
    rules: [
      {
        validNodeName: ["P", "H4", "H5", "H6"],
      },
    ],
  },
  {
    getNode: () => ({ type: Heading1Type }),
    isElement: true,
    rules: [
      {
        validNodeName: "H1",
      },
    ],
  },
  {
    getNode: () => ({ type: Heading2Type }),
    isElement: true,
    rules: [
      {
        validNodeName: "H2",
      },
    ],
  },
  {
    getNode: () => ({ type: Heading3Type }),
    isElement: true,
    rules: [
      {
        validNodeName: "H3",
      },
    ],
  },
  {
    getNode: (el) => ({ type: ImageType, url: el.getAttribute("src") }),
    isElement: true,
    rules: [
      {
        validNodeName: "IMG",
      },
    ],
  },
  {
    getNode: (el) => ({ type: LinkType, url: el.getAttribute("href") }),
    isElement: true,
    rules: [
      {
        validNodeName: "A",
      },
    ],
  },
  {
    getNode: () => ({ type: DividerType }),
    isElement: true,
    rules: [
      {
        validNodeName: "HR",
      },
    ],
  },
  {
    getNode: () => ({ type: BlockquoteType }),
    isElement: true,
    rules: [
      {
        validNodeName: "BLOCKQUOTE",
      },
    ],
  },
  {
    getNode: (el) => {
      const { listType, depth } = getListItemProps(el);

      return {
        type: ListItemType,
        depth,
        listType,
      };
    },
    isElement: true,
    rules: [
      {
        validNodeName: ["LI"],
      },
    ],
  },
  {
    isLeaf: true,
    getNode: () => ({ bold: true }),
    rules: [
      { validNodeName: ["STRONG", "B"] },
      {
        validStyle: {
          fontWeight: ["600", "700", "bold"],
        },
      },
    ],
  },
  {
    isLeaf: true,
    getNode: () => ({ italic: true }),
    rules: [
      { validNodeName: ["EM", "I"] },
      {
        validStyle: {
          fontStyle: "italic",
        },
      },
    ],
  },
  {
    isLeaf: true,
    getNode: () => ({ code: true }),
    rules: [
      {
        validNodeName: ["CODE"],
      },
      {
        validStyle: {
          wordWrap: "break-word",
        },
      },
    ],
  },
  {
    isLeaf: true,
    getNode: () => ({ underline: true }),
    rules: [
      {
        validNodeName: ["U"],
      },
      {
        validStyle: {
          textDecoration: ["underline"],
        },
      },
    ],
  },
];

export const deserializePlugins: PlatePlugin<any, any>[] = rules.map((rule) =>
  createPluginFactory<any>({
    key: nanoid(4),
    deserializeHtml: rule,
  })()
);

deserializePlugins.forEach((p) => {
  p.inject = {};
});
