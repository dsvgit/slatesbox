import { UseSlatePlugin } from "plugins/types";
import { withResetType } from "plugins/resetType/withResetType";

const useResetTypePlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withResetType,
  };
};

export default useResetTypePlugin;
