import { Element } from "slate";

export interface IdentityElement {
  id?: string;
}

export interface HashedElement {
  hash?: string;
}

export type FoldingElement = {
  folded?: boolean;
};

export type SemanticNode = {
  element: Element;
  children: SemanticNode[];
  index: number;
};
