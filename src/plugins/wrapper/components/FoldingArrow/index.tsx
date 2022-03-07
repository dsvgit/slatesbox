import React, { memo, useEffect, useState } from "react";
import { Element } from "slate";
import { useSlate } from "slate-react";
import cn from "classnames";

import { isFoldingElement } from "slate-extended/utils";
import { isListItemElement } from "plugins/list/utils";
import { ExtendedEditor } from "slate-extended/extendedEditor";

type Props = {
  onFold?: React.MouseEventHandler;
};

const FoldingArrow = (props: Props & { element: Element }) => {
  const [_, setState] = useState(0);
  const editor = useSlate();
  const { element, onFold } = props;

  useEffect(() => {
    setState((state) => state + 1);
  }, [editor.children]);

  if (
    isFoldingElement(element) &&
    ExtendedEditor.semanticNode(element).children.length > 0
  ) {
    return (
      <FoldingArrowMemoized
        folded={Boolean(element.folded)}
        isList={isListItemElement(element)}
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
        className={cn("folding", { "folding-list": isList, folded: folded })}
        onMouseDown={onFold}
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
