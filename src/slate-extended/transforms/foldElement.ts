import { Editor, Element, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { ExtendedEditor } from "slate-extended/extendedEditor";
import { isFoldingElement } from "slate-extended/utils";
import { updateHash } from "slate-extended/transforms/updateHash";

export const foldElement = (editor: Editor, element: Element) => {
  const path = ReactEditor.findPath(editor, element);
  const semanticDescendants = ExtendedEditor.semanticDescendants(element);
  const semanticPath = ExtendedEditor.semanticPath(element);

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

      for (const semanticNode of semanticDescendants) {
        updateHash(editor, semanticNode);
      }

      for (const semanticNode of semanticPath) {
        updateHash(editor, semanticNode);
      }
    });
  }
};
