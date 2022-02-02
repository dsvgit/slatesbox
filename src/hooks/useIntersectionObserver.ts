import { useEffect, useState } from "react";

const useIntersectionObserver = (ref: any, deps: any[] = []) => {
  const [isInViewport, setIsInViewport] = useState(false);

  const handleChange = (entries: any) => {
    const result = entries.some((entry: any) => entry.isIntersecting);
    setIsInViewport(result);
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleChange, options);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, deps);

  return isInViewport;
};

export default useIntersectionObserver;
