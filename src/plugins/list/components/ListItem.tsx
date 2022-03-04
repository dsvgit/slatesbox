import React from "react";
import cn from "classnames";

import { ElementProps } from "plugins/types";
import { ListItemElement, ListTypes } from "plugins/list/types";
import { getPointerContent } from "plugins/list/getPointerContent";
import { useSlateStatic } from "slate-react";
import { isTodoListItemElement } from "plugins/list/utils";
import { checkTodoItem } from "plugins/list/transforms";
import { foldElement } from "slate-extended/transforms/foldElement";

const ListItem = (props: ElementProps & { element: ListItemElement }) => {
  const editor = useSlateStatic();

  const { children, attributes, element } = props;
  const { depth, listType } = element;

  return (
    <li
      {...attributes}
      className={cn("list-item", `list-item-${listType}`)}
      style={
        {
          "--pointer-content": `"${getPointerContent({
            depth,
            index: 0,
            listType,
          })}"`,
        } as React.CSSProperties
      }
    >
      {(listType === ListTypes.Bulleted || listType === ListTypes.Numbered) && (
        <button
          contentEditable={false}
          className="pointer"
          onMouseDown={() => {
            // TODO: check if it has semantic children
            foldElement(editor, element);
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
