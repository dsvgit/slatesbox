import { useEffect } from "react";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";
import create from "zustand";

import { useZustandStoreSelector } from "hooks/useZustandCreateStore";

type ObserverState = {
  isScrolling: boolean;
  setIsScrolling: (isScrolling: boolean) => void;
  isInViewport: boolean;
  setIsInViewport: (isInViewport: boolean) => void;
  result: boolean;
};

export const createState = () =>
  create<ObserverState>((set) => ({
    isScrolling: false,
    setIsScrolling: (isScrolling) =>
      set(({ isInViewport, result }) => ({
        isScrolling,
        result: isScrolling ? result : isInViewport,
      })),
    isInViewport: false,
    setIsInViewport: (isInViewport) =>
      set(({ isScrolling, result }) => ({
        isInViewport,
        result: isScrolling ? result : isInViewport,
      })),
    result: false,
  }));

const useWrapperIntersectionObserver = (
  ref: any,
  isDragging: boolean,
  deps: any[] = []
) => {
  const { state: result, getState } = useZustandStoreSelector(
    createState,
    ({ result }) => result,
    []
  );

  useEffect(() => {
    const { setIsScrolling } = getState();

    if (isDragging) {
      setIsScrolling(false);
      return;
    }

    let timeout: any = null;

    const listener = () => {
      clearTimeout(timeout);
      setIsScrolling(true);

      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 250);
    };

    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
      clearTimeout(timeout);
    };
  }, [isDragging]);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const handleChange = (entries: any) => {
      const { setIsInViewport } = getState();

      const result = entries.some((entry: any) => entry.isIntersecting);
      setIsInViewport(result);
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleChange, options);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, deps);

  return result;
};

export default useWrapperIntersectionObserver;
