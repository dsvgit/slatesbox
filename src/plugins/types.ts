import { RenderElementProps } from "slate-react";

export type ElementProps = {
  element: RenderElementProps["element"];
  children: RenderElementProps["children"];
  attributes?: RenderElementProps["attributes"];
};
