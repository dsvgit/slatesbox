import React from "react";

import {
  Heading1Element,
  Heading2Element,
  Heading3Element,
} from "plugins/heading/types";
import { ElementProps } from "plugins/types";

export const Heading1 = (
  props: ElementProps & { element: Heading1Element }
) => {
  const { children, attributes } = props;

  return <h1 {...attributes}>{children}</h1>;
};

export const Heading2 = (
  props: ElementProps & { element: Heading2Element }
) => {
  const { children, attributes } = props;

  return <h2 {...attributes}>{children}</h2>;
};

export const Heading3 = (
  props: ElementProps & { element: Heading3Element }
) => {
  const { children, attributes } = props;

  return <h3 {...attributes}>{children}</h3>;
};
