import React from "react";

import { ImageElement } from "plugins/image/types";
import { ElementProps } from "plugins/types";

const Image = (props: ElementProps & { element: ImageElement }) => {
  const { children, attributes, element } = props;

  return (
    <div className="image-wrapper">
      <img
        style={{
          width: "100%",
        }}
        {...attributes}
        contentEditable={false}
        src={element.url}

      />
      <div className="image" />
    </div>
  );
};

export default Image;
