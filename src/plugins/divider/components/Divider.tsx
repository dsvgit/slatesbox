import React from "react";

import { DividerElement } from "../types";
import { ElementProps } from "plugins/types";

const Divider = (props: ElementProps & { element: DividerElement }) => {
  const { children, attributes, element } = props;

  return (
    <div contentEditable={false} {...attributes}>
      {children}
      <hr  style={{ userSelect: "none" }} />
    </div>
  );
};

export default Divider;
