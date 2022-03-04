import { useMemo } from "react";
import { UseBoundStore } from "zustand";
import { State, StateSelector, StoreApi } from "zustand/vanilla";

const useZustandStore = <TState extends State, U>(
  create: () => UseBoundStore<TState, StoreApi<TState>>,
  deps: any[]
) => {
  const useStore = useMemo(() => create(), [create, ...deps]);

  return { getState: useStore.getState, state: useStore() };
};

export const useZustandStoreSelector = <TState extends State, U>(
  create: () => UseBoundStore<TState, StoreApi<TState>>,
  selector: StateSelector<TState, U>,
  deps: any[]
) => {
  const useStore = useMemo(() => create(), [create, ...deps]);

  return { getState: useStore.getState, state: useStore(selector) };
};

export default useZustandStore;
