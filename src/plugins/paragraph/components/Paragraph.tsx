import React from "react";

import { ParagraphElement } from "plugins/paragraph/types";
import { ElementProps } from "plugins/types";

const Paragraph = (props: ElementProps & { element: ParagraphElement }) => {
  const { children, attributes } = props;

  return (
    <p {...attributes} className="slate-p">
      {children}
    </p>
  );
};

export default Paragraph;
