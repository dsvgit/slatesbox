import { UseSlatePlugin } from "plugins/types";
import { withExtended } from "slate-extended/withExtended";
import { Editor } from "slate";
import { ExtendedEditor } from "slate-extended/extendedEditor";

type Options = {
  compareLevels: (editor: Editor) => ExtendedEditor["compareLevels"];
};
const useExtendedPlugin: UseSlatePlugin<Options> = (options) => {
  return {
    withOverrides: withExtended(options),
  };
};

export default useExtendedPlugin;
