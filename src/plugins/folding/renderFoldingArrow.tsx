import React from "react";

const renderFoldingArrow = (
  folded: boolean | undefined = false,
  onFold?: React.MouseEventHandler
) => {
  return (
    <button
      contentEditable={false}
      className="folding"
      style={
        {
          "--rotate": folded ? "0deg" : "90deg",
        } as React.CSSProperties
      }
      onClick={onFold}
    >
      &gt;
    </button>
  );
};

export default renderFoldingArrow;
