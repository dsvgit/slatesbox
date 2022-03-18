import { Editor, Element, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { ExtendedEditor } from "slate-extended/extendedEditor";
import { updateHash } from "slate-extended/transforms/updateHash";
import { SemanticNode } from "slate-extended/types";

export const foldElement = (editor: Editor, element: Element) => {
  const path = ReactEditor.findPath(editor, element);
  const semanticDescendants = ExtendedEditor.semanticDescendants(element);

  if (ExtendedEditor.isFoldingElement(editor, element)) {
    Editor.withoutNormalizing(editor, () => {
      const index = path[0];

      if (!ReactEditor.isFocused(editor)) {
        // focus and select to change editor state to editable
        ReactEditor.focus(editor);
        Transforms.select(editor, Editor.end(editor, [index]));
      }

      if (!element.folded) {
        const lastDescendantIndex =
          semanticDescendants[semanticDescendants.length - 1]?.index ?? index;

        const isFoldedChildrenSelected =
          !editor.selection ||
          Range.includes(
            Editor.range(editor, [index], [lastDescendantIndex]),
            editor.selection
          );
        if (isFoldedChildrenSelected) {
          // select folded parent content if selection is inside its children
          Transforms.select(editor, Editor.end(editor, [index]));
        }
      }

      Transforms.setNodes(
        editor,
        element.folded
          ? { folded: false, foldedCount: 0 }
          : {
              folded: true,
              foldedCount: semanticDescendants.length,
            },
        {
          at: path,
          match: (node) => node === element,
        }
      );

      for (const semanticNode of semanticDescendants) {
        updateHash(editor, semanticNode);

        if (!element.folded) {
          updateFoldedCount(editor, semanticNode);
        }
      }
    });
  }
};

const updateFoldedCount = (editor: Editor, semanticNode: SemanticNode) => {
  const { element, index } = semanticNode;

  const semanticDescendants = ExtendedEditor.semanticDescendants(element);

  if (ExtendedEditor.isFoldingElement(editor, element) && element.folded) {
    Transforms.setNodes(
      editor,
      { foldedCount: semanticDescendants.length },
      {
        at: [index],
        match: (node) => node === element,
      }
    );
  }
};
