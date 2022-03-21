import React from "react";

import { UseSlatePlugin } from "plugins/types";
import { isParagraphElement } from "plugins/paragraph/utils";
import Paragraph from "plugins/paragraph/components/Paragraph";

const useParagraphPlugin: UseSlatePlugin = () => {
  return {
    renderElement: (props) => {
      if (isParagraphElement(props.element)) {
        return <Paragraph {...props} element={props.element} />;
      }

      return null;
    },
  };
};

export default useParagraphPlugin;
