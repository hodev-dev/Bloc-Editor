import React, { useState, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import ReactDOM from 'react-dom';

import * as uuid from 'uuid';
const HeaderText = (props: any) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const boldText = () => {
    const nextState = RichUtils.toggleInlineStyle(editorState, "BOLD");
    setEditorState(nextState);
  };

  return (
    <div>
      <button type="button" onClick={boldText}>
        Bold
      </button>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
      />
    </div>
  );
}

export default HeaderText;
