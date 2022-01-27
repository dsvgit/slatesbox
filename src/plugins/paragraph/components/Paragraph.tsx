import React from "react";
import { RenderElementProps } from "slate-react";

import { ParagraphElement } from "plugins/paragraph/types";

const Paragraph = (
  props: RenderElementProps & { element: ParagraphElement }
) => {
  const { children, attributes } = props;

  return <p {...attributes}>{children}</p>;
};

export default Paragraph;
