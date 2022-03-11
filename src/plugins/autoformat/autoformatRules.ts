import { AutoformatRule } from "@udecode/plate-autoformat";
import {
  Heading1Type,
  Heading2Type,
  Heading3Type,
} from "plugins/heading/types";
import { ListItemType, ListTypes } from "plugins/list/types";
import { Editor } from "slate";
import { toggleList } from "plugins/list/transforms";

export const autoformatRules: AutoformatRule[] = [
  {
    mode: "block",
    type: Heading1Type,
    match: "# ",
  },
  {
    mode: "block",
    type: Heading2Type,
    match: "## ",
  },
  {
    mode: "block",
    type: Heading3Type,
    match: "### ",
  },
  {
    mode: "block",
    type: ListItemType,
    match: ["* ", "- "],
    format: (editor: Editor) => {
      toggleList(editor, { listType: ListTypes.Bulleted });
    },
  },
  {
    mode: "block",
    type: ListItemType,
    match: ["1. ", "1) "],
    format: (editor: Editor) => {
      toggleList(editor, { listType: ListTypes.Numbered });
    },
  },
  {
    mode: "block",
    type: ListItemType,
    match: ["[] ", "x ", "X "],
    format: (editor: Editor) => {
      toggleList(editor, { listType: ListTypes.TodoList });
    },
  },
];
