import React, { memo, useEffect, useState } from "react";
import { Element } from "slate";
import { useSlate } from "slate-react";
import cn from "classnames";

import { ExtendedEditor } from "slate-extended/extendedEditor";

type Props = {
  onFold?: React.MouseEventHandler;
};

const FoldingArrow = (props: Props & { element: Element }) => {
  const [, forceRerender] = useState(0);
  const editor = useSlate();
  const { element, onFold } = props;

  useEffect(() => {
    forceRerender((state) => state + 1);
  }, [editor.children]);

  if (
    ExtendedEditor.isFoldingElement(editor, element) &&
    ExtendedEditor.semanticNode(element).children.length > 0
  ) {
    return (
      <FoldingArrowMemoized
        folded={Boolean(element.folded)}
        isList={ExtendedEditor.isNestingElement(editor, element)}
        onFold={onFold}
      />
    );
  }

  return null;
};

const FoldingArrowMemoized = memo(
  (props: Props & { isList: boolean; folded: boolean }) => {
    const { isList, folded, onFold } = props;

    return (
      <button
        contentEditable={false}
        className={cn("folding", "clipboardSkip", {
          "folding-list": isList,
          folded: folded,
        })}
        onMouseDown={(e) => {
          e.preventDefault();
          onFold && onFold(e);
        }}
      >
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
  }
);

export default FoldingArrow;
