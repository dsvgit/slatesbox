import { Descendant } from "slate";

export type DividerType = "hr";
export const DividerType: DividerType = "hr";

export type DividerElement = {
  type: DividerType;
  children: Descendant[];
};
