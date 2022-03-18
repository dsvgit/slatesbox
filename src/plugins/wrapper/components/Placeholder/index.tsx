import React from "react";
import { Range } from "slate";
import { useSlate } from "slate-react";

const Placeholder = () => {
  const editor = useSlate();

  if (!(editor.selection && Range.isCollapsed(editor.selection))) {
    return null;
  }

  return (
    <div contentEditable={false} className="placeholder clipboardSkip">
      Type something here..
    </div>
  );
};

export default Placeholder;
