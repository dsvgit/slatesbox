import { RenderElementProps } from "slate-react";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export type ElementProps = {
  element: RenderElementProps["element"];
  children: RenderElementProps["children"];
  attributes?: RenderElementProps["attributes"];
  // listeners: SyntheticListenerMap | undefined;
};
