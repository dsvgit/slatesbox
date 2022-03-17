import React from "react";
import cn from "classnames";
import { useSlate, useSlateStatic } from "slate-react";

import { ElementProps } from "plugins/types";
import { ListItemElement, ListTypes } from "plugins/list/types";
import {
  getBulletedPointerContent,
  getNumberedPointerContent,
} from "plugins/list/getPointerContent";
import { isTodoListItemElement } from "plugins/list/utils";
import { checkTodoItem } from "plugins/list/transforms";
import { foldElement } from "slate-extended/transforms/foldElement";
import { ExtendedEditor } from "slate-extended/extendedEditor";

const ListItem = (props: ElementProps & { element: ListItemElement }) => {
  const editor = useSlateStatic();

  const { children, attributes, element } = props;
  const { depth, listType } = element;

  return (
    <div {...attributes} className={cn("list-item", `list-item-${listType}`)}>
      {listType === ListTypes.Bulleted && (
        <button
          contentEditable={false}
          className="pointer clipboardSkip"
          style={
            {
              "--pointer-content": `"${getBulletedPointerContent(depth)}"`,
            } as React.CSSProperties
          }
          onMouseDown={() => {
            foldElement(editor, element);
          }}
        />
      )}
      {listType === ListTypes.Numbered && <NumberedPointer element={element} />}
      {isTodoListItemElement(element) && (
        <div contentEditable={false} className="pointer clipboardSkip">
          <input
            className="checkbox-pointer"
            type="checkbox"
            checked={Boolean(element.checked)}
            onChange={(e) => checkTodoItem(editor, element, e.target.checked)}
          />
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

const NumberedPointer = (props: { element: ListItemElement }) => {
  const editor = useSlate(); // useSlate to rerender pointer content (index) when this element isn't changed directly

  const { element } = props;
  const { depth } = element;

  const semanticNode = ExtendedEditor.semanticNode(element);
  const { listIndex } = semanticNode;

  return (
    <button
      contentEditable={false}
      className="pointer clipboardSkip"
      style={
        {
          "--pointer-content": `"${getNumberedPointerContent(
            depth,
            listIndex
          )}"`,
        } as React.CSSProperties
      }
      onMouseDown={() => {
        foldElement(editor, element);
      }}
    />
  );
};

export default ListItem;
