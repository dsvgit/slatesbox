import React from "react";

import { UseSlatePlugin } from "plugins/types";
import { isBlockquoteElement } from "plugins/blockquote/utils";
import Blockquote from "plugins/blockquote/components/Blockquote";

const useBlockquotePlugin: UseSlatePlugin = () => {
  return {
    renderElement: (props) => {
      if (isBlockquoteElement(props.element)) {
        return <Blockquote {...props} element={props.element} />;
      }

      return null;
    },
  };
};

export default useBlockquotePlugin;
