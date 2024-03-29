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
import { ListItemElement } from "plugins/list/types";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { HashedElement, IdentityElement } from "slate-extended/types";
import { FormattedText } from "plugins/marks/types";
import { LinkElement } from "plugins/link/types";
import { BlockquoteElement } from "plugins/blockquote/types";

export type CustomEditor = Omit<
  BaseEditor & ReactEditor & HistoryEditor,
  "children"
> &
  ExtendedEditor;

export type CustomElement =
  | ParagraphElement
  | Heading1Element
  | Heading2Element
  | Heading3Element
  | ImageElement
  | LinkElement
  | BlockquoteElement
  | DividerElement
  | ListItemElement;

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement & IdentityElement & HashedElement;
    Text: CustomText;
  }
}
