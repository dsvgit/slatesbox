import React from "react";

import { UseSlatePlugin } from "plugins/types";
import { withLink } from "plugins/link/withLink";
import { isLinkElement } from "plugins/link/utils";
import Link from "plugins/link/components/Link";

const useLinkPlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withLink,
    renderElement: (props) => {
      if (isLinkElement(props.element)) {
        return <Link {...props} element={props.element} />;
      }

      return null;
    },
  };
};

export default useLinkPlugin;
