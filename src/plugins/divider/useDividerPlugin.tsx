import React from "react";

import { UseSlatePlugin } from "plugins/types";
import { isDividerElement } from "plugins/divider/utils";
import Divider from "plugins/divider/components/Divider";
import { withDivider } from "plugins/divider/withDivider";

const useDividerPlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withDivider,
    renderElement: (props) => {
      if (isDividerElement(props.element)) {
        return <Divider {...props} element={props.element} />;
      }

      return null;
    },
  };
};

export default useDividerPlugin;
