import { Editor } from "slate";

import { SlatePlugin } from "plugins/types";
import { composePlugins } from "utils";
import { useMemo } from "react";

const useEditor = (createEditor: () => Editor, plugins: SlatePlugin[]) => {
  return useMemo(
    () =>
      composePlugins(
        plugins.filter((x) => x.withOverrides).map((x) => x.withOverrides!),
        createEditor()
      ),
    []
  );
};

export default useEditor;
