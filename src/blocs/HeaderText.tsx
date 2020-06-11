import React, { useState, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator, ContentBlock } from 'draft-js';
import Immutable from 'immutable';
import ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import "draft-js/dist/Draft.css";


const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock: any, callback: any, contentState: any) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock: any, callback: any, contentState: any) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex: any, contentBlock: any, callback: any) {
  const text = contentBlock.getText();
  let matchArr,
    start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const HandleSpan = (props: any) => {
  return (
    <span className="bg-green-100" data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};

const HashtagSpan = (props: any) => {
  return (
    <span className="bg-blue-600" data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};

const HeaderText = (props: any) => {
  const { change, id, initState } = props;

  const compositeDecorator = new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: HandleSpan
    }, {
      strategy: hashtagStrategy,
      component: HashtagSpan
    }
  ]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty(compositeDecorator));
  const [showControll, setShowControll] = useState(false);
  const [ReadOnly, setReadOnly] = useState(false);

  const blockRenderMap = Immutable.Map({
    'header-one': {
      element: 'h1'
    },
    'header-two': {
      element: 'h2'
    },
    'header-three': {
      element: 'h3'
    },
    'header-four': {
      element: 'h4'
    },
    'header-five': {
      element: 'h5'
    },
    'unstyled': {
      element: 'div'
    }
  });

  const myBlockStyleFn = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType();
    if (type === 'header-one') {
      return String("text-5xl");
    }
    else if (type === 'header-two') {
      return String("text-4xl");
    }
    else if (type === 'header-three') {
      return String("text-3xl");
    }
    else if (type === 'header-four') {
      return String("text-2xl");
    }
    else if (type === 'header-five') {
      return String("text-xl");
    }
    return "";
  }
  useEffect(() => {
    var init;
    if (initState && initState == '') {
      init = EditorState.createEmpty(compositeDecorator);
    } else if (initState) {
      const raw = convertFromRaw(initState);
      init = EditorState.createWithContent(raw, compositeDecorator);
    } else {
      init = EditorState.createEmpty(compositeDecorator);
    }
    setEditorState(init);
  }, [initState])

  const handleChange = (e: any) => {
    const rawState: any = convertToRaw(editorState.getCurrentContent());
    setEditorState(e);
    change(id, rawState);
  }

  const update = (newState: any) => {
    setEditorState(newState);
  }

  const handleKeyCommand = (command: any) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      update(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  const _toggleBlockType = (blockType: string) => {
    update(RichUtils.toggleBlockType(editorState, blockType));
  }

  const _toggleBlocStyle = (blocStyle: string) => {
    update(RichUtils.toggleInlineStyle(editorState, blocStyle));
  }
  const focus = () => {
    setReadOnly(false);
    setShowControll(true)
  }

  const blur = () => {
    setReadOnly(true);
    setShowControll(false)
  }

  return (
    <div className="" onClick={focus}>
      <div className={(showControll) ? " sticky top-0 w-full border z-40 bg-white " : "hidden"}>
        <button onClick={() => _toggleBlocStyle('ITALIC')} className="h-8 w-16 border">I</button>
        <button onClick={() => _toggleBlocStyle('BOLD')} className="h-8 w-16 border">B</button>
        <button onClick={() => _toggleBlocStyle('UNDERLINE')} className="h-8 w-16 border">U</button>
        <button onClick={() => _toggleBlocStyle('CODE')} className="h-8 w-16 border">C</button>
        <button onClick={() => _toggleBlockType('header-one')} className="h-8 w-16 border">H1</button>
        <button onClick={() => _toggleBlockType('header-two')} className="h-8 w-16 border">H2</button>
        <button onClick={() => _toggleBlockType('header-three')} className="h-8 w-16 border">H3</button>
        <button onClick={() => _toggleBlockType('header-four')} className="h-8 w-16 border">H4</button>
        <button onClick={() => _toggleBlockType('header-five')} className="h-8 w-16 border">H5</button>
        <button className="h-8 w-16 border">OL</button>
        <button className="h-8 w-16 border">UL</button>
      </div>
      <Editor
        editorState={editorState}
        blockStyleFn={myBlockStyleFn}
        placeholder="enter something"
        onChange={(e: any) => handleChange(e)}
        handleKeyCommand={handleKeyCommand}
        blockRenderMap={blockRenderMap}
        spellCheck={true}
      />
    </div >
  );
}

export default HeaderText;
