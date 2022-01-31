import { createContext, useContext } from "react";

import { SemanticNode } from "plugins/folding/utils";

type EditorStateValue = {
  semanticTree: SemanticNode[];
};

const EditorStateContext = createContext<EditorStateValue>({
  semanticTree: [],
});

export const useEditorState = () => {
  return useContext(EditorStateContext);
};

export const EditorStateProvider = EditorStateContext.Provider;
