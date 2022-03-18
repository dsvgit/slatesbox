import crawl from "tree-crawl";

export const crawlChildren = <
  T extends {
    children: T[];
  }
>(
  children: T[],
  iteratee: (node: T, context: crawl.Context<T>) => void,
  options: crawl.Options<T> = {}
): void => {
  const root = { children } as T;

  crawl<T>(
    root,
    (node, context) => {
      if (node === root) {
        return;
      }

      iteratee(node, context);
    },
    options
  );
};
