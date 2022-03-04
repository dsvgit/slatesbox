import { Element } from "slate";
import { SemanticNode } from "slate-extended/types";

export const ELEMENT_TO_SEMANTIC_PATH: WeakMap<Element, SemanticNode[]> =
  new WeakMap();
