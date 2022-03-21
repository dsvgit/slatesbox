import { UseSlatePlugin } from "plugins/types";
import * as handlers from "./handlers";

const useSoftBreakPlugin: UseSlatePlugin = () => {
  return {
    handlers,
  };
};

export default useSoftBreakPlugin;
