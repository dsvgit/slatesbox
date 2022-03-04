import { Editor, Transforms, Element, Range } from "slate";
import { ReactEditor } from "slate-react";
import { nanoid } from "nanoid";

import {
  getSemanticDescendants,
  getSemanticPath,
  SemanticNode,
} from "plugins/semantic/utils";
import { isFoldingElement } from "plugins/folding/utils";

export const foldElement = (editor: Editor, element: Element) => {
  const path = ReactEditor.findPath(editor, element);
  const semanticDescendants = getSemanticDescendants(element);
  const semanticPath = getSemanticPath(element);

  if (isFoldingElement(element)) {
    Editor.withoutNormalizing(editor, () => {
      const index = path[0];
      const maxIndex = semanticDescendants
        ? semanticDescendants.reduce((a, x) => Math.max(x.index, a), index)
        : index;

      if (!ReactEditor.isFocused(editor)) {
        // focus and select to change editor state to editable
        ReactEditor.focus(editor);
        Transforms.select(editor, Editor.end(editor, [index]));
      }

      if (!element.folded) {
        if (
          !editor.selection ||
          Range.includes(
            Editor.range(editor, [index], [maxIndex]),
            editor.selection
          )
        ) {
        }
        Transforms.select(editor, Editor.end(editor, [index]));
      }

      Transforms.setNodes(
        editor,
        element.folded ? { folded: false } : { folded: true },
        {
          at: path,
          match: (node) => node === element,
        }
      );

      if (semanticDescendants) {
        for (const semanticNode of semanticDescendants) {
          updateHash(editor, semanticNode);
        }
      }

      if (semanticPath) {
        for (const semanticNode of semanticPath) {
          updateHash(editor, semanticNode);
        }
      }
    });
  }
};

export const updateHash = (editor: Editor, semanticNode: SemanticNode) => {
  const { element, index } = semanticNode;

  Transforms.setNodes(
    editor,
    { hash: nanoid(4) },
    {
      at: [index],
      match: (node) => node === element,
    }
  );
};
