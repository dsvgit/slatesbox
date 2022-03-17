export const removeSkippedElements = (clipboardNode: Element) => {
  const elements = Array.from(
    clipboardNode.getElementsByClassName("clipboardSkip")
  );

  elements.forEach((elem) => elem.remove());
};
