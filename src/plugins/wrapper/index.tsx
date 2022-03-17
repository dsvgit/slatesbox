import React, { useCallback } from "react";
import { RenderElementProps, useSelected, useSlateStatic } from "slate-react";

import { useDndState } from "hooks/useDndState";
import useWrapperIntersectionObserver from "plugins/wrapper/useWrapperIntersectionObserver";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { foldElement } from "slate-extended/transforms/foldElement";
import { Sortable } from "plugins/wrapper/components/Sortable";
import { Item, ItemProps } from "plugins/wrapper/components/Item";
import { isListItemElement, isTodoListItemElement } from "plugins/list/utils";
import cn from "classnames";
import { makeListItemAttributes } from "plugins/serialization/utils";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes, children, element } = props;
  const { activeId, dragDepth } = useDndState();

  const editor = useSlateStatic();
  const id = element.id!;
  const selected = useSelected();

  const semanticNode = ExtendedEditor.semanticNode(element);
  const { hidden, listIndex } = semanticNode;

  const isInViewport = useWrapperIntersectionObserver(
    attributes.ref,
    activeId != null,
    [hidden]
  );

  const sortableEnabled =
    !hidden && (selected || isInViewport || activeId === element.id);

  const handleFold = useCallback(() => {
    foldElement(editor, element);
  }, [editor, element]);

  const itemProps: ItemProps = {
    element: element,
    elementRef: attributes.ref,
    selected: selected,
    hidden: hidden,
    onFold: handleFold,
    isInViewport: isInViewport,
    dragDepth: dragDepth,
  };

  const isDragging = activeId === id;
  const realSpacing = isListItemElement(element) ? 50 * element.depth : 0;
  const dragSpacing = 50 * dragDepth;

  const Tag = isListItemElement(element) ? "li" : "div";

  return (
    <Tag
      {...attributes}
      {...(isListItemElement(element)
        ? makeListItemAttributes({
            depth: element.depth,
            listType: element.listType,
            index: listIndex,
            checked: isTodoListItemElement(element) && element.checked,
          })
        : {})}
      data-slate-node-type={element.type}
      className={cn("item-container", "clipboardSkipLinebreak", {
        "item-container-list": isListItemElement(element),
      })}
      style={
        {
          "--spacing": `${isDragging ? dragSpacing : realSpacing}px`,
        } as React.CSSProperties
      }
    >
      {sortableEnabled ? (
        <Sortable id={id} {...itemProps}>
          {children}
        </Sortable>
      ) : (
        <Item {...itemProps}>{children}</Item>
      )}
    </Tag>
  );
};

export default Wrapper;
