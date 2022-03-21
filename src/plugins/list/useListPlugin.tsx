import React from "react";

import { UseSlatePlugin } from "plugins/types";
import withList from "plugins/list/withList";
import * as handlers from "./handlers";
import { isListItemElement } from "plugins/list/utils";
import ListItem from "plugins/list/components/ListItem";

const useListPlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withList,
    handlers,
    renderElement: (props) => {
      if (isListItemElement(props.element)) {
        return <ListItem {...props} element={props.element} />;
      }

      return null;
    },
  };
};

export default useListPlugin;
