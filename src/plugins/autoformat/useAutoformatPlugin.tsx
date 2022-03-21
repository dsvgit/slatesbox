import { AutoformatRule } from "@udecode/plate-autoformat";

import { UseSlatePlugin } from "plugins/types";
import { withAutoformat } from "plugins/autoformat/withAutoformat";

type Options = { rules: AutoformatRule[] };

const useAutoformatPlugin: UseSlatePlugin<Options> = ({ rules }) => {
  return {
    withOverrides: withAutoformat(rules),
  };
};

export default useAutoformatPlugin;
