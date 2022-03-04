import { Element } from "slate";

import {
  ListItemType,
  ListItemElement,
  TodoListItemElement,
  ListTypes,
} from "./types";

export const isListItemElement = (value: any): value is ListItemElement => {
  return Element.isElementType<ListItemElement>(value, ListItemType);
};

export const isTodoListItemElement = (
  value: any
): value is TodoListItemElement => {
  return (
    Element.isElementType<TodoListItemElement>(value, ListItemType) &&
    value.listType === ListTypes.TodoList
  );
};
