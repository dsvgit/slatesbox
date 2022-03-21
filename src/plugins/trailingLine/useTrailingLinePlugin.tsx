import { UseSlatePlugin } from "plugins/types";
import { withTrailingLine } from "plugins/trailingLine/withTrailingLine";

const useTrailingLinePlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withTrailingLine,
  };
};

export default useTrailingLinePlugin;
