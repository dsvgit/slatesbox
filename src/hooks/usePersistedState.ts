import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";

const usePersistedState = <S>(
  id: string,
  initialState: (restored: any) => S
): [S, Dispatch<SetStateAction<S>>] => {
  const key = `${id}`;

  const persistor = useMemo(
    () => ({
      persist: (state: any) => {
        try {
          localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      restore: () => {
        const item = localStorage.getItem(key);

        if (!item) {
          return null;
        }

        try {
          const state = JSON.parse(item);
          return state;
        } catch (error) {
          console.error(error);
          localStorage.removeItem(key);
          return null;
        }
      },
    }),
    [key]
  );

  const [state, setState] = useState<S>(() => {
    const restored = persistor.restore();

    return initialState(restored);
  });

  useEffect(() => {
    persistor.persist(state);
  }, [persistor, state]);

  return [state, setState];
};

export default usePersistedState;
