import React from "react";

import { ElementProps } from "plugins/types";
import { LinkElement } from "../types";

const Link = (props: ElementProps & { element: LinkElement }) => {
  const { attributes, children, element } = props;
  const { url } = element;

  return (
    <a
      {...attributes}
      href={url}
      onClick={(e) => {
        const linkElement = e.currentTarget;

        if (linkElement) {
          e.preventDefault();
          const href = linkElement.href;
          window.open(href, "_blank");
        }
      }}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
// copied from slate inlines examples
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className="clipboardSkip"
    style={{ fontSize: 0 }}
  >
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

export default Link;
