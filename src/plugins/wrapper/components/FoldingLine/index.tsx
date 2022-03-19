import React, { memo, useEffect, useState } from "react";
import { Element } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { getClientRect } from "@dnd-kit/core";
import { Transform } from "@dnd-kit/utilities";

import { ExtendedEditor } from "slate-extended/extendedEditor";
import { useDndState } from "slate-extended/dnd/useDndState";

type Props = {
  onFold?: React.MouseEventHandler;
  transform?: Transform | null;
};

const FoldingLine = (props: Props & { element: Element }) => {
  const editor = useSlate();
  const { activeId } = useDndState();
  const { element, onFold, transform } = props;
  const [height, setHeight] = useState(0);

  const hasFoldingLine =
    ExtendedEditor.isNestingElement(editor, element) &&
    ExtendedEditor.isFoldingElement(editor, element) &&
    ExtendedEditor.semanticNode(element).children.length > 0;

  useEffect(() => {
    if (!hasFoldingLine) {
      height && setHeight(0);
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

      const byNextSibling = lastDescendant.id === activeId;

      Promise.resolve().then(() => {
        const rect1 = getClientRect(elementDom.querySelector("div")!);
        const top = rect1.top + 26;

        let bottom;
        if (byNextSibling && lastDescendantDom.nextElementSibling) {
          const rect2 = getClientRect(
            lastDescendantDom.nextElementSibling.querySelector("div")!
          );
          bottom = rect2.top;
        } else {
          const rect2 = getClientRect(lastDescendantDom.querySelector("div")!);
          bottom = rect2.top + rect2.height;
        }

        const newHeight = Math.floor(bottom - top);
        setHeight(newHeight);
      });
    } catch (error) {
      console.error(error);
    }
  }, [hasFoldingLine, transform, editor.children]);

  if (hasFoldingLine && activeId == null) {
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
