import { UseSlatePlugin } from "plugins/types";
import { withNodeId } from "plugins/nodeId/withNodeId";

const useNodeIdPlugin: UseSlatePlugin = () => {
  return {
    withOverrides: withNodeId,
  };
};

export default useNodeIdPlugin;
