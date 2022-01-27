import React from "react";
import { RenderElementProps } from "slate-react";

import {
  Heading1Element,
  Heading2Element,
  Heading3Element,
} from "plugins/heading/types";

export const Heading1 = (
  props: RenderElementProps & { element: Heading1Element }
) => {
  const { children, attributes } = props;

  return <h1 {...attributes}>{children}</h1>;
};

export const Heading2 = (
  props: RenderElementProps & { element: Heading2Element }
) => {
  const { children, attributes } = props;

  return <h1 {...attributes}>{children}</h1>;
};

export const Heading3 = (
  props: RenderElementProps & { element: Heading3Element }
) => {
  const { children, attributes } = props;

  return <h1 {...attributes}>{children}</h1>;
};
