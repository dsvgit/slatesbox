import { Editor, Element, Node } from "slate";
import { nanoid } from "nanoid";
import { clone } from "ramda";

const makeId = () => nanoid(16);

export const assignIdRecursively = (node: Node) => {
  if (Element.isElement(node)) {
    node.id = makeId();

    node.children.forEach(assignIdRecursively);
  }
};

export const withNodeId = (editor: Editor) => {
  const { apply } = editor;

  editor.apply = (operation) => {
    if (operation.type === "insert_node") {
      // clone to be able to write (read-only)
      const node = clone(operation.node);

      assignIdRecursively(node);

      return apply({
        ...operation,
        node,
      });
    }

    if (operation.type === "split_node") {
      const properties = operation.properties;

      // only for elements (node with a type)
      if ("type" in properties && properties.type != null) {
        let id = makeId();

        return apply({
          ...operation,
          properties: {
            ...operation.properties,
            id,
          },
        });
      }
    }

    return apply(operation);
  };

  return editor;
};
