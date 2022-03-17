import React from "react";
import { DraggableSyntheticListeners } from "@dnd-kit/core";

type Props = {
  listeners: DraggableSyntheticListeners | undefined;
};

const DragHandle = ({ listeners }: Props) => {
  return (
    <button
      contentEditable={false}
      className="handle clipboardSkip"
      {...listeners}
    >
      ⠿
    </button>
  );
};

export default DragHandle;
