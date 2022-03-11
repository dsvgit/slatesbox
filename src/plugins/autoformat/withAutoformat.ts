import { Editor, Range } from "slate";
import {
  autoformatBlock,
  autoformatMark,
  AutoformatRule,
  autoformatText,
} from "@udecode/plate-autoformat";

/**
 * Enables support for autoformatting actions.
 * Once a match rule is validated, it does not check the following rules.
 */
export const withAutoformat = (rules: AutoformatRule[]) => (editor: Editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    if (editor.selection && !Range.isCollapsed(editor.selection)) {
      return insertText(text);
    }

    for (const rule of rules!) {
      const { mode = "text", insertTrigger, query } = rule;

      if (query && !query(editor, { ...rule, text })) continue;

      const autoformatter: Record<typeof mode, Function> = {
        block: autoformatBlock,
        mark: autoformatMark,
        text: autoformatText,
      };

      if (
        autoformatter[mode]?.(editor, {
          ...(rule as any),
          text,
        })
      ) {
        return insertTrigger && insertText(text);
      }
    }

    insertText(text);
  };

  return editor;
};
