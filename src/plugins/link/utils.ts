import { Descendant, Element } from "slate";

import { LinkType, LinkElement } from "./types";

export const createLinkElement = ({
  url,
  text,
  children = [],
}: {
  url: string;
  text?: string;
  children?: Descendant[];
}): LinkElement => {
  if (text) {
    children = [{ text }];
  }

  return { type: LinkType, url, children };
};

export const isLinkElement = (value: any): value is LinkElement => {
  return Element.isElementType<LinkElement>(value, LinkType);
};
