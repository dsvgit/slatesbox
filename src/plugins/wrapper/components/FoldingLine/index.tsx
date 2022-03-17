import React, { memo, useEffect, useState } from "react";
import { Element } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { getClientRect } from "@dnd-kit/core";

import { ExtendedEditor } from "slate-extended/extendedEditor";
import { isListItemElement } from "plugins/list/utils";
import { isFoldingElement } from "slate-extended/utils";

type Props = {
  onFold?: React.MouseEventHandler;
};

const FoldingLine = (props: Props & { element: Element }) => {
  const editor = useSlate();
  const { element, onFold } = props;
  const [height, setHeight] = useState(0);

  const hasFoldingLine =
    isListItemElement(element) &&
    isFoldingElement(element) &&
    ExtendedEditor.semanticNode(element).children.length > 0;

  useEffect(() => {
    if (!hasFoldingLine) {
      setHeight(0);
      return;
    }

    try {
      const semanticDescendants = ExtendedEditor.semanticDescendants(element);

      const lastDescendant =
        semanticDescendants[semanticDescendants.length - 1]?.element;

      if (!lastDescendant) {
        return;
      }

      const elementDom = ReactEditor.toDOMNode(editor, element);
      const lastDescendantDom = ReactEditor.toDOMNode(editor, lastDescendant);

      const rect1 = getClientRect(elementDom);
      const rect2 = getClientRect(lastDescendantDom);

      const height = rect2.top + rect2.height - rect1.top - 26;

      setHeight(height);
    } catch (error) {
      console.error(error);
    }
  }, [hasFoldingLine, editor.children]);

  if (hasFoldingLine) {
    return (
      <FoldingLineMemoized
        depth={element.depth}
        height={height}
        onFold={onFold}
      />
    );
  }

  return null;
};

const FoldingLineMemoized = memo(
  ({ depth, height, onFold }: Props & { depth: number; height: number }) => {
    return (
      <div
        contentEditable={false}
        className="list-line clipboardSkip"
        onClick={onFold}
        style={
          {
            "--height": `${height}px`,
          } as React.CSSProperties
        }
      />
    );
  }
);

export default FoldingLine;
