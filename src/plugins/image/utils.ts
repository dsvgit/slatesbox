import { Element } from "slate";

import { ImageType, ImageElement } from "./types";

export const isImageElement = (value: any): value is ImageElement => {
  return Element.isElementType<ImageElement>(value, ImageType);
};
