export const isDOMText = (value: Node): value is Text => {
  return value.nodeType === 3;
};

export const isDOMElement = (value: Node): value is Element => {
  return value.nodeType === 1;
};

export const getPlainText = (domNode: any) => {
  let text = "";

  if (isDOMText(domNode) && domNode.nodeValue) {
    return domNode.nodeValue;
  }

  if (isDOMElement(domNode)) {
    if (domNode.classList.contains("clipboardSkip")) {
      return "";
    }

    for (const childNode of Array.from(domNode.childNodes)) {
      text += getPlainText(childNode);
    }

    const skipLinebreak =
      domNode.classList.contains("clipboardSkipLinebreak") ||
      (domNode.tagName === "P" &&
        domNode.querySelector("[data-slate-zero-width]"));

    if (!skipLinebreak) {
      const display = getComputedStyle(domNode).getPropertyValue("display");

      if (
        display === "block" ||
        display === "list" ||
        domNode.tagName === "BR"
      ) {
        text += "\n";
      }
    }
  }

  return text;
};
