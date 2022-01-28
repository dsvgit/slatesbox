import { Descendant } from "slate";

export type ImageType = "img";
export const ImageType: ImageType = "img";

export type ImageElement = {
  type: ImageType;
  url: string;
  children: Descendant[];
};
