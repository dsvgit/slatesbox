import React, { useEffect, useState } from "react";
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import type { Transform } from "@dnd-kit/utilities";
import cn from "classnames";
import { Editor, Path, Transforms, Element } from "slate";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { isIOS } from "react-device-detect";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";

import {
  getSemanticChildren,
  getSemanticDescendants, getSemanticPath,
  isFoldedChild,
} from "plugins/semantic/utils";
import { isFoldingElement } from "plugins/folding/utils";
import renderFoldingArrow from "plugins/folding/renderFoldingArrow";
import renderDndHandle from "plugins/dnd/renderDndHandle";
import { useDndState } from "hooks/useDndState";
import useWrapperIntersectionObserver from "plugins/wrapper/useWrapperIntersectionObserver";
import { isListItemElement } from "plugins/list/utils";
import {foldElement, updateHash} from "plugins/folding/transforms";
import { getClientRect } from "@dnd-kit/core";

const Wrapper = (
  props: Omit<RenderElementProps, "children"> & { children: React.ReactNode }
) => {
  const { attributes, children, element } = props;
  const { activeId } = useDndState();

  const editor = useSlateStatic();
  const id = element.id!;
  const selected = useSelected();

  const hidden = isFoldedChild(element);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const semanticPath = getSemanticPath(element);

    if (semanticPath) {
      for (const semanticNode of semanticPath) {
        updateHash(editor, semanticNode);
      }
    }

    return () => {
      const semanticPath = getSemanticPath(element);

      if (semanticPath) {
        for (const semanticNode of semanticPath) {
          updateHash(editor, semanticNode);
        }
      }
    };
  }, [element.type]);

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

  const isInViewport = useWrapperIntersectionObserver(
    attributes.ref,
    activeId != null,
    [hidden]
  );

  const sortableEnabled =
    !hidden && (selected || isInViewport || activeId === element.id);

  const handleFold = () => {
    foldElement(editor, element);
  };

  return (
    <div {...attributes} style={{ position: "relative" }}>
      {isListItemElement(element) &&
        isFoldingElement(element) &&
        !element.folded && (
          <div
            contentEditable={false}
            className="list-line"
            onClick={() => foldElement(editor, element)}
            style={
              {
                "--spacing": `${22 * element.depth}px`,
                "--height": `${height}px`,
              } as React.CSSProperties
            }
          />
        )}
      {sortableEnabled ? (
        <Sortable
          id={id}
          rootRef={attributes.ref}
          element={element}
          handle={selected}
          onFold={handleFold}
          isInViewport={isInViewport}
          hidden={hidden}
        >
          {children}
        </Sortable>
      ) : (
        <Item
          element={element}
          handle={selected}
          onFold={handleFold}
          isInViewport={isInViewport}
          hidden={hidden}
        >
          {children}
        </Item>
      )}
    </div>
  );
};

const Sortable = ({
  id,
  rootRef,
  ...props
}: {
  id: string;
  rootRef: React.RefObject<HTMLDivElement>;
} & ItemProps) => {
  const sortableProps = useSortable({
    id,
    transition: {
      duration: 350,
      easing: "ease",
    },
  });

  useIsomorphicLayoutEffect(() => {
    sortableProps.setNodeRef(rootRef.current);
  });

  return <Item {...props} {...sortableProps} />;
};

type SortableAttributes = ReturnType<typeof useSortable>["attributes"];

type ItemProps = {
  element: Element;
  transition?: string | null;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
  isSorting?: boolean;
  handle?: boolean;
  onFold?: React.MouseEventHandler;
  isDragOverlay?: boolean;
  isInViewport?: boolean;
  hidden?: boolean;
  children: React.ReactNode;
  attributes?: SortableAttributes;
};

export const Item = ({
  element,
  children,
  transition,
  transform,
  listeners,
  isDragging = false,
  isSorting = false,
  handle = false,
  onFold,
  isDragOverlay = false,
  isInViewport = false,
  hidden = false,
  attributes,
}: ItemProps) => {
  return (
    <div
      {...attributes}
      className={cn("wrapper", {
        dragging: isDragging,
        selected: handle,
        dragOverlay: isDragOverlay,
        disableSelection: isIOS && isSorting,
        disableInteraction: isSorting,
        hidden: hidden,
        // indicator: isDragging,
      })}
      style={
        {
          transition,
          "--translate-x": transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          "--translate-y": transform
            ? `${Math.round(transform.y)}px`
            : undefined,
        } as React.CSSProperties
      }
    >
      {renderDndHandle(listeners)}
      {isFoldingElement(element) &&
        !isListItemElement(element) &&
        renderFoldingArrow(element.folded, onFold)}
      {children}
    </div>
  );
};

export default Wrapper;
