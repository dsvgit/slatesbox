import { Descendant } from "slate";

import { FoldingElement, NestingElement } from "slate-extended/types";

export type ListItemType = "list_item";
export const ListItemType: ListItemType = "list_item";

type BaseListItemElement = {
  type: ListItemType;
  children: Descendant[];
} & NestingElement &
  FoldingElement;

export enum ListTypes {
  Bulleted = "bulleted",
  Numbered = "numbered",
  TodoList = "todoList",
}

type BulletedListItemElement = BaseListItemElement & {
  listType: ListTypes.Bulleted;
};

type NumberedListItemElement = BaseListItemElement & {
  listType: ListTypes.Numbered;
};

export type TodoListItemElement = BaseListItemElement & {
  listType: ListTypes.TodoList;
  checked: boolean;
};

export type ListItemElement =
  | BulletedListItemElement
  | NumberedListItemElement
  | TodoListItemElement;
