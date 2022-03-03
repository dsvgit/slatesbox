import { useEffect, useState } from "react";
import { useIsomorphicLayoutEffect } from "@dnd-kit/utilities";

const useIntersectionObserver = (ref: any, deps: any[] = []) => {
  const [isInViewport, setIsInViewport] = useState(false);

  const handleChange = (entries: any) => {
    const result = entries.some((entry: any) => entry.isIntersecting);
    setIsInViewport(result);
  };

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const options = {
      root: null,
      rootMargin: "500px 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleChange, options);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, deps);

  return isInViewport;
};

export default useIntersectionObserver;
