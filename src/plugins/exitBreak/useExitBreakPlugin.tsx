import { UseSlatePlugin } from "plugins/types";
import * as handlers from "plugins/exitBreak/handlers";

const useExitBreakPlugin: UseSlatePlugin = () => {
  return {
    handlers,
  };
};

export default useExitBreakPlugin;
