import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

import { ParagraphElement } from "plugins/paragraph/types";
import {
  Heading1Element,
  Heading2Element,
  Heading3Element,
} from "plugins/heading/types";
import { ImageElement } from "plugins/image/types";
import { DividerElement } from "plugins/divider/types";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type CustomElement =
  | ParagraphElement
  | Heading1Element
  | Heading2Element
  | Heading3Element
  | ImageElement
  | DividerElement;

export type FormattedText = { text: string; bold?: true };

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
