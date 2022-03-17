import { createContext, useContext } from "react";

type DndStateValue = {
  activeId: string | null;
  dragDepth: number;
  dragOverlayHeight: number;
};

const DndStateContext = createContext<DndStateValue>({} as DndStateValue);

export const useDndState = () => {
  return useContext(DndStateContext);
};

export const DndStateProvider = DndStateContext.Provider;
