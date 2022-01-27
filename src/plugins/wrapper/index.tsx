import React from "react";
import { RenderElementProps } from "slate-react";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes, children } = props;
  return (
    <div {...attributes} className="wrapper">
      <button contentEditable={false} className="handle">
        ⠿
      </button>
      {children}
    </div>
  );
};

export default Wrapper;
