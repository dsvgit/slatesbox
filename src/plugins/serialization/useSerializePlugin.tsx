import { UseSlatePlugin } from "plugins/types";
import { withSerialize } from "plugins/serialization/withSerialize";

const useSerializePlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withSerialize,
  };
};

export default useSerializePlugin;
