import { UseSlatePlugin } from "plugins/types";
import { withImage } from "plugins/image/withImage";
import { isImageElement } from "plugins/image/utils";
import Image from "plugins/image/components/Image";
import React from "react";

const useImagePlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withImage,
    renderElement: (props) => {
      if (isImageElement(props.element)) {
        return <Image {...props} element={props.element} />;
      }

      return null;
    },
  };
};

export default useImagePlugin;
