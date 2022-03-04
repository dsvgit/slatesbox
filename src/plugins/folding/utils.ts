import { FoldingElement } from "plugins/folding/types";
import { isHeadingElement } from "plugins/heading/utils";
import { isListItemElement } from "plugins/list/utils";

export const isFoldingElement = (element: any): element is FoldingElement => {
  return isHeadingElement(element) || isListItemElement(element);
};
