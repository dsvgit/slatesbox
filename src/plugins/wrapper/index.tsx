import React, { useCallback } from "react";
import { RenderElementProps, useSelected, useSlateStatic } from "slate-react";
import cn from "classnames";

import { useDndState } from "slate-extended/dnd/useDndState";
import useWrapperIntersectionObserver from "plugins/wrapper/useWrapperIntersectionObserver";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { foldElement } from "slate-extended/transforms/foldElement";
import { Sortable } from "plugins/wrapper/components/Sortable";
import { Item, ItemProps } from "plugins/wrapper/components/Item";
import { isTodoListItemElement } from "plugins/list/utils";
import { makeListItemAttributes } from "plugins/serialization/utils";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes, children, element } = props;
  const { activeId, activeElement, dragDepth, dragOverlayHeight } =
    useDndState();

  const editor = useSlateStatic();
  const id = element.id!;
  const selected = useSelected();

  const semanticNode = ExtendedEditor.semanticNode(element);
  const { listIndex } = semanticNode;
  const isHiddenById =
    ExtendedEditor.isNestingElement(editor, activeElement) &&
    activeId !== id &&
    ExtendedEditor.isHiddenById(element, activeId);
  const hidden = semanticNode.hidden || isHiddenById;

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
  const realSpacing = ExtendedEditor.isNestingElement(editor, element)
    ? 50 * element.depth
    : 0;
  const dragSpacing = 50 * dragDepth;

  const Tag = ExtendedEditor.isNestingElement(editor, element) ? "li" : "div";

  return (
    <Tag
      {...attributes}
      {...(ExtendedEditor.isNestingElement(editor, element)
        ? makeListItemAttributes({
            depth: element.depth,
            listType: element.listType,
            index: listIndex,
            checked: isTodoListItemElement(element) && element.checked,
          })
        : {})}
      data-slate-node-type={element.type}
      className={cn("item-container", "clipboardSkipLinebreak", {
        "item-container-list": ExtendedEditor.isNestingElement(editor, element),
        dragging: activeId === id,
      })}
      style={
        {
          "--spacing": `${isDragging ? dragSpacing : realSpacing}px`,
          ...(dragOverlayHeight
            ? {
                "--drag-overlay-height": `${dragOverlayHeight}px`,
              }
            : null),
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
