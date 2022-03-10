import { createContext, useContext } from "react";

import { SemanticNode } from "slate-extended/types";

type EditorStateValue = {
  semanticTree: SemanticNode[];
  droppableIntervals: [number, number][];
  droppableStarts: Set<number>;
  droppableEnds: Set<number>;
};

const EditorStateContext = createContext<EditorStateValue>(
  {} as EditorStateValue
);

export const useEditorState = () => {
  return useContext(EditorStateContext);
};

export const EditorStateProvider = EditorStateContext.Provider;
