import React from "react";

import { BlockquoteElement } from "../types";
import { ElementProps } from "plugins/types";

const Blockquote = (props: ElementProps & { element: BlockquoteElement }) => {
  const { children, attributes } = props;

  return <blockquote {...attributes}>{children}</blockquote>;
};

export default Blockquote;
