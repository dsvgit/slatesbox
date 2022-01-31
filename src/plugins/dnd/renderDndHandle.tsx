import React from "react";

import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const renderDndHandle = (listeners: SyntheticListenerMap | undefined) => {
  return (
    <button contentEditable={false} className="handle" {...listeners}>
      ⠿
    </button>
  );
};

export default renderDndHandle;
