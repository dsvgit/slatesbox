import { Element } from "slate";

import { DividerType, DividerElement } from "./types";

export const isDividerElement = (value: any): value is DividerElement => {
  return Element.isElementType<DividerElement>(value, DividerType);
};
