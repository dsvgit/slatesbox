import { Element } from "slate";

import { ParagraphType, ParagraphElement } from "./types";

export const isParagraphElement = (value: any): value is ParagraphElement => {
  return Element.isElementType<ParagraphElement>(value, ParagraphType);
};
