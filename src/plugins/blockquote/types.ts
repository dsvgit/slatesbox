import { Descendant } from "slate";

export type BlockquoteType = "blockquote";
export const BlockquoteType: BlockquoteType = "blockquote";

export type BlockquoteElement = {
  id: string;
  type: BlockquoteType;
  children: Descendant[];
};
