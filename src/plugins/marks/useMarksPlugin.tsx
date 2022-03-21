import { UseSlatePlugin } from "plugins/types";
import { renderLeaf } from "plugins/marks/renderLeaf";
import * as handlers from "plugins/marks/handlers";

const useMarksPlugin: UseSlatePlugin = () => {
  return {
    handlers,
    renderLeaf,
  };
};

export default useMarksPlugin;
