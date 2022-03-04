import React, { useEffect, useLayoutEffect, useState } from "react";
import cn from "classnames";

import { ElementProps } from "plugins/types";
import { ListItemElement, ListTypes } from "plugins/list/types";
import { getPointerContent } from "plugins/list/getPointerContent";
import { foldElement, updateHash } from "plugins/folding/transforms";
import { ReactEditor, useSlateStatic } from "slate-react";
import { isFoldingElement } from "plugins/folding/utils";
import {
  getSemanticChildren,
  getSemanticDescendants,
  getSemanticPath,
} from "plugins/semantic/utils";
import { isTodoListItemElement } from "plugins/list/utils";
import { checkTodoItem } from "plugins/list/transforms";
import { getClientRect } from "@dnd-kit/core";

const IndentationWidth = 22;

const ListItem = (props: ElementProps & { element: ListItemElement }) => {
  const editor = useSlateStatic();
  const [height, setHeight] = useState(0);

  const { children, attributes, element } = props;
  const { depth, listType } = element;

  const semanticChildren = getSemanticChildren(element);
  const hasSemanticChildren =
    semanticChildren != null && semanticChildren.length > 0;

  useEffect(() => {
    try {
      const semanticDescendants = getSemanticDescendants(element);

      const sibling = semanticDescendants
        ? semanticDescendants[semanticDescendants.length - 1]?.element
        : null;

      if (!sibling) {
        return;
      }

      const elementDom = ReactEditor.toDOMNode(editor, element);
      const siblingDom = ReactEditor.toDOMNode(editor, sibling);

      const rect1 = getClientRect(elementDom);
      const rect2 = getClientRect(siblingDom);

      const height = rect2.top + rect2.height - rect1.top - 26;

      setHeight(height);
    } catch (error) {
      console.error(error);
    }
  }, [editor, element]);

  return (
    <li
      {...attributes}
      className={cn("list-item", `list-item-${listType}`, {
        folded: isFoldingElement(element) && element.folded,
        hasChildren: hasSemanticChildren,
      })}
      style={
        {
          "--spacing": `${IndentationWidth * depth}px`,
          "--pointer-content": `"${getPointerContent({
            depth,
            index: 0,
            listType,
          })}"`,
        } as React.CSSProperties
      }
    >
      <button
        contentEditable={false}
        className="folding-pointer"
        onMouseDown={() => {
          hasSemanticChildren && foldElement(editor, element);
        }}
      >
        ᐯ
      </button>
      {(listType === ListTypes.Bulleted || listType === ListTypes.Numbered) && (
        <button
          contentEditable={false}
          className="pointer"
          onMouseDown={() => {
            hasSemanticChildren && foldElement(editor, element);
          }}
        />
      )}
      {isTodoListItemElement(element) && (
        <div contentEditable={false} className="pointer">
          <input
            className="checkbox-pointer"
            type="checkbox"
            checked={Boolean(element.checked)}
            onChange={(e) => checkTodoItem(editor, element, e.target.checked)}
          />
        </div>
      )}
      <div>{children}</div>
    </li>
  );
};

export default ListItem;
