import { withHistory } from "slate-history";
import { withReact } from "slate-react";

import { SlatePlugin } from "plugins/types";
import useTrailingLinePlugin from "plugins/trailingLine/useTrailingLinePlugin";
import useResetTypePlugin from "plugins/resetType/useResetTypePlugin";
import useAutoformatPlugin from "plugins/autoformat/useAutoformatPlugin";
import { autoformatRules } from "plugins/autoformat/autoformatRules";
import useListPlugin from "plugins/list/useListPlugin";
import useDividerPlugin from "plugins/divider/useDividerPlugin";
import useHeadingPlugin from "plugins/heading/useHeadingPlugin";
import useLinkPlugin from "plugins/link/useLinkPlugin";
import useImagePlugin from "plugins/image/useImagePlugin";
import useSerializePlugin from "plugins/serialization/useSerializePlugin";
import useDeserializePlugin from "plugins/serialization/useDeserializePlugin";
import useNodeIdPlugin from "plugins/nodeId/useNodeIdPlugin";
import useExtendedPlugin from "slate-extended/useExtendedPlugin";
import { compareLevels } from "components/utils";
import useMarksPlugin from "plugins/marks/useMarksPlugin";
import useSoftBreakPlugin from "plugins/softBreak/useSoftBreakPlugin";
import useExitBreakPlugin from "plugins/exitBreak/useExitBreakPlugin";
import useBlockquotePlugin from "plugins/blockquote/useBlockquotePlugin";

const usePlugins = (): SlatePlugin[] => {
  const plugins = [
    useTrailingLinePlugin({}),
    useResetTypePlugin({}),
    useSoftBreakPlugin({}),
    useExitBreakPlugin({}),
    useAutoformatPlugin({ rules: autoformatRules }),
    useListPlugin({}),
    useDividerPlugin({}),
    useHeadingPlugin({}),
    useLinkPlugin({}),
    useBlockquotePlugin({}),
    useImagePlugin({}),
    useSerializePlugin({}),
    useDeserializePlugin({}),
    useMarksPlugin({}),
    useExtendedPlugin({
      compareLevels,
    }),
    useNodeIdPlugin({}),
    {
      withOverrides: withHistory,
    },
    {
      withOverrides: withReact,
    },
  ];

  return plugins;
};

export default usePlugins;
