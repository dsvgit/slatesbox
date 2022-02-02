import { createContext, useContext } from "react";

type DndStateValue = {
  activeId: string | null;
};

const DndStateContext = createContext<DndStateValue>({
  activeId: null,
});

export const useDndState = () => {
  return useContext(DndStateContext);
};

export const DndStateProvider = DndStateContext.Provider;
