import { Element } from "slate";

export interface IdentityElement {
  id?: string;
}

export interface HashedElement {
  hash?: string;
}

export type FoldingElement = {
  folded?: boolean;
  foldedCount?: number;
};

export type SemanticNode<T extends Element = Element> = {
  element: T;
  children: SemanticNode[];
  index: number;
  hidden: boolean;
  folded: SemanticNode | undefined;
  descendantsCount: number;
};
