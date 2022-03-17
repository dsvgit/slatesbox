import { Element } from "slate";

import { BlockquoteElement, BlockquoteType } from "./types";

export const isBlockquoteElement = (value: any): value is BlockquoteElement => {
  return Element.isElementType<BlockquoteElement>(value, BlockquoteType);
};
