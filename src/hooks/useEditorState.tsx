import { createContext, useContext } from "react";

import {SemanticNode} from "slate-extended/types";

type EditorStateValue = {
  semanticTree: SemanticNode[];
  droppableIntervals: [number, number][];
  droppableStarts: Set<number>;
  droppableEnds: Set<number>;
};

const EditorStateContext = createContext<EditorStateValue>({
  semanticTree: [],
  droppableIntervals: [],
  droppableStarts: new Set(),
  droppableEnds: new Set(),
});

export const useEditorState = () => {
  return useContext(EditorStateContext);
};

export const EditorStateProvider = EditorStateContext.Provider;
