import React, { useCallback } from "react";
import { Editor } from "slate";
import { DefaultElement, ReactEditor, RenderElementProps } from "slate-react";

import { ElementProps } from "plugins/types";
import {
  isHeading1Element,
  isHeading2Element,
  isHeading3Element,
} from "plugins/heading/utils";
import {
  Heading1,
  Heading2,
  Heading3,
} from "plugins/heading/components/Heading";
import { isImageElement } from "plugins/image/utils";
import Image from "plugins/image/components/Image";
import { isParagraphElement } from "plugins/paragraph/utils";
import Paragraph from "plugins/paragraph/components/Paragraph";
import Wrapper from "plugins/wrapper";
import { isDividerElement } from "plugins/divider/utils";
import Divider from "plugins/divider/components/Divider";

const useRenderElement = (editor: Editor) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const { attributes, children, element } = props;

      const path = ReactEditor.findPath(editor, element);

      if (path.length === 1) {
        return (
          <Wrapper attributes={attributes} element={element}>
            {renderElementContent({
              element,
              children,
            })}
          </Wrapper>
        );
      }

      return renderElementContent({
        attributes,
        element,
        children,
      });
    },
    [editor]
  );

  return renderElement;
};

export default useRenderElement;

export const renderElementContent = (props: ElementProps) => {
  if (isHeading1Element(props.element)) {
    return <Heading1 {...props} element={props.element} />;
  }

  if (isHeading2Element(props.element)) {
    return <Heading2 {...props} element={props.element} />;
  }

  if (isHeading3Element(props.element)) {
    return <Heading3 {...props} element={props.element} />;
  }

  if (isImageElement(props.element)) {
    return <Image {...props} element={props.element} />;
  }

  if (isDividerElement(props.element)) {
    return <Divider {...props} element={props.element} />;
  }

  if (isParagraphElement(props.element)) {
    return <Paragraph {...props} element={props.element} />;
  }

  return (
    <DefaultElement
      children={props.element}
      element={props.element}
      attributes={props.attributes!}
    />
  );
};
