import React, { Fragment, useMemo, useState } from "react";
import { useSlate } from "slate-react";

import { ExtendedEditor } from "slate-extended/extendedEditor";
import { ELEMENT_TO_SEMANTIC_PATH } from "slate-extended/weakMaps";

const SlateExtended = (props: { children: React.ReactNode }) => {
  const editor = useSlate();
  const { children } = props;

  const initializeExtendedEditor = () => {
    editor.semanticChildren = ExtendedEditor.getSemanticChildren(
      editor,
      editor.children,
      {
        setPath: (element, path) => {
          ELEMENT_TO_SEMANTIC_PATH.set(element, path);
        },
      }
    );
  };

  useState(initializeExtendedEditor);
  useMemo(initializeExtendedEditor, [editor.children]);

  return <Fragment>{children}</Fragment>;
};

export default SlateExtended;
