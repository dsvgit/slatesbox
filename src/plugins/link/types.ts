import { Descendant } from "slate";

export type LinkType = "a";
export const LinkType: LinkType = "a";

export type LinkElement = {
  type: LinkType;
  url: string;
  children: Descendant[];
};
