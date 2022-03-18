import React from "react";
import {
  ListOrderedIcon,
  ListUnorderedIcon,
  TasklistIcon,
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  LinkIcon,
} from "@primer/octicons-react";

import { toggleList } from "plugins/list/transforms";
import { useSlateStatic } from "slate-react";
import { ListTypes } from "plugins/list/types";
import { toggleElement, toggleMark } from "transforms";
import { ParagraphType } from "plugins/paragraph/types";
import {
  Heading1Type,
  Heading2Type,
  Heading3Type,
} from "plugins/heading/types";
import { insertLink, unwarpLinks } from "plugins/link/transforms";

const EditorToolbar = () => {
  const editor = useSlateStatic();

  return (
    <div
      style={{
        marginBottom: 18,
        userSelect: "none",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleElement(editor, ParagraphType);
          }}
          className="toolbar-button"
        >
          P
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleElement(editor, Heading1Type);
          }}
          className="toolbar-button"
        >
          H1
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleElement(editor, Heading2Type);
          }}
          className="toolbar-button"
        >
          H2
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleElement(editor, Heading3Type);
          }}
          className="toolbar-button"
        >
          H3
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleList(editor, { listType: ListTypes.Bulleted });
          }}
          className="toolbar-button"
        >
          <ListUnorderedIcon />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleList(editor, { listType: ListTypes.Numbered });
          }}
          className="toolbar-button"
        >
          <ListOrderedIcon />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleList(editor, { listType: ListTypes.TodoList });
          }}
          className="toolbar-button"
        >
          <TasklistIcon />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            const url = prompt("Link URL: ");

            if (url) {
              insertLink(editor, url);
            }
          }}
          className="toolbar-button"
        >
          <LinkIcon />
        </button>

        <button
          style={{ position: "relative" }}
          onMouseDown={(e) => {
            e.preventDefault();
            unwarpLinks(editor);
          }}
          className="toolbar-button"
        >
          <LinkIcon />
          <span
            style={{
              position: "absolute",
              bottom: -2,
              right: 5,
              fontSize: 10,
              color: "tomato",
            }}
          >
            x
          </span>
        </button>
      </div>

      <div>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "bold");
          }}
          className="toolbar-button"
        >
          <BoldIcon />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "italic");
          }}
          className="toolbar-button"
        >
          <ItalicIcon />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "code");
          }}
          className="toolbar-button"
        >
          <CodeIcon />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "underline");
          }}
          className="toolbar-button"
        >
          U̲
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
