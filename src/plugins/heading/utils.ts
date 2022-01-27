import { Element } from "slate";

import {
  Heading1Type,
  Heading1Element,
  Heading2Type,
  Heading2Element,
  Heading3Type,
  Heading3Element,
} from "./types";

export const isHeading1Element = (value: any): value is Heading1Element => {
  return Element.isElementType<Heading1Element>(value, Heading1Type);
};

export const isHeading2Element = (value: any): value is Heading2Element => {
  return Element.isElementType<Heading2Element>(value, Heading2Type);
};

export const isHeading3Element = (value: any): value is Heading3Element => {
  return Element.isElementType<Heading3Element>(value, Heading3Type);
};

export const isHeadingElement = (
  value: any
): value is Heading1Element | Heading2Element | Heading3Element => {
  return (
    isHeading1Element(value) ||
    isHeading2Element(value) ||
    isHeading3Element(value)
  );
};
