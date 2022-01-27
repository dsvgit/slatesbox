import { Descendant } from "slate";

export type ParagraphType = "p";
export const ParagraphType: ParagraphType = "p";

export type ParagraphElement = {
  // id: string;
  type: ParagraphType;
  children: Descendant[];
};
