import { UseSlatePlugin } from "plugins/types";
import { withDeserialize } from "plugins/serialization/withDeserialize";

const useDeserializePlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withDeserialize,
  };
};

export default useDeserializePlugin;
