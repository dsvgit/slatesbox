import { Node } from 'slate';

export const isEmptyNode = (node: any) => {
  const result = node && Node.string(node) === "";
  return result;
};
