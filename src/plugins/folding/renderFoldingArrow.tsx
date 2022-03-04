import React from "react";

const renderFoldingArrow = (
  folded: boolean | undefined = false,
  onFold?: React.MouseEventHandler
) => {
  return (
    <button contentEditable={false} className="folding" onMouseDown={onFold}>
      <div
        style={
          {
            "--rotate": folded ? "0deg" : "90deg",
          } as React.CSSProperties
        }
      >
        &gt;
      </div>
    </button>
  );
};

export default renderFoldingArrow;
