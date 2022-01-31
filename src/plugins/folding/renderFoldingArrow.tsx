import React from "react";
import { Editor, Transforms, Element, Path } from "slate";

import { isFoldingElement } from "plugins/folding/utils";

const renderFoldingArrow = (editor: Editor, element: Element, path: Path) => {
  if (!isFoldingElement(element)) {
    return null;
  }

  const handleFold = () => {
    Transforms.setNodes(
      editor,
      { folded: !element.folded },
      {
        at: path,
        match: (node) => node === element,
      }
    );
  };

  return (
    <button
      contentEditable={false}
      className="folding"
      style={
        {
          "--rotate": element.folded ? "0deg" : "90deg",
        } as React.CSSProperties
      }
      onClick={handleFold}
    >
      &gt;
    </button>
  );
};

export default renderFoldingArrow;
