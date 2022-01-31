import React from "react";

import type { DraggableSyntheticListeners } from "@dnd-kit/core";

const renderDndHandle = (
  listeners: DraggableSyntheticListeners | undefined
) => {
  return (
    <button contentEditable={false} className="handle" {...listeners}>
      ⠿
    </button>
  );
};

export default renderDndHandle;
