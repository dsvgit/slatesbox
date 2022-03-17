import { Element } from "slate";
import { isListItemElement } from "plugins/list/utils";
import { ExtendedEditor } from "slate-extended/extendedEditor";

export function getDepth(
  items: Element[],
  activeItem: Element,
  overId: string,
  offsetDepth: number
) {
  const activeId = activeItem.id!;

  if (!isListItemElement(activeItem)) {
    return 0;
  }

  items = items.filter((element) => {
    const semanticNode = ExtendedEditor.semanticNode(element);

    const isHiddenById =
      activeId !== element.id && ExtendedEditor.isHiddenById(element, activeId);

    return !(semanticNode.hidden || isHiddenById);
  });

  const activeItemIndex = items.indexOf(activeItem);

  const overItemIndex = items.findIndex(({ id }) => id === overId);

  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];

  const maxDepth = isListItemElement(previousItem) ? previousItem.depth + 1 : 0;
  const minDepth = isListItemElement(nextItem) ? nextItem.depth : 0;

  const projectedDepth = activeItem.depth + offsetDepth;
  let dragDepth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    dragDepth = maxDepth;
  } else if (projectedDepth < minDepth) {
    dragDepth = minDepth;
  }

  return dragDepth;
}

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );

  return newArray;
}
