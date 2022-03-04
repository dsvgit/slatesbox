import { Editor, Transforms } from "slate";
import { nanoid } from "nanoid";

import {SemanticNode} from "slate-extended/types";

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
