import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator, ContentBlock, Modifier } from 'draft-js';
import _ from 'lodash';
import Immutable from 'immutable';
import ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import "draft-js/dist/Draft.css";
import { prependOnceListener } from 'cluster';
import { IrootReducer } from '../reducers/rootReducer';


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



const MediaComponent = (props: any) => {
  const { editorState } = props;
  let selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(anchorKey);

  //Then based on the docs for SelectionState -
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  const selectedText = currentBlock.getText().slice(start, end);
  return (
    <div className="bg-green-400">{"selectedText"}</div>
  )
}

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
  const [state, setState] = useState<any>('');
  const [showControll, setShowControll] = useState(false);
  const [ReadOnly, setReadOnly] = useState(false);
  const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
  const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;

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
    'atomic': {
      editable: true,
      element: "test",
      wrapper: <MediaComponent editorState={editorState} />
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
    console.log({ state });
  }, [state])

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

  const clearInlineStyles = (editorState: any, styles: any) => {
    const contentWithoutStyles = _.reduce(styles, (newContentState, style) => (
      Modifier.removeInlineStyle(
        newContentState,
        editorState.getSelection(),
        style
      )
    ), editorState.getCurrentContent());
    return EditorState.push(
      editorState,
      contentWithoutStyles,
      'change-inline-style'
    );
  };


  const _toggle_color = (color: string) => {
    const inlineStyle = editorState.getCurrentInlineStyle();
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap)
      .reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );
    const currentStyle = editorState.getCurrentInlineStyle();
    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state: any, color: any) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    // If the color is being toggled on, apply it.
    if (!currentStyle.has(color)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        color
      );
    }
    update(nextEditorState);
  }

  var COLORS = [
    { label: 'Red', style: 'red' },
    { label: 'Orange', style: 'orange' },
    { label: 'Yellow', style: 'yellow' },
    { label: 'Green', style: 'green' },
    { label: 'Blue', style: 'blue' },
    { label: 'Indigo', style: 'indigo' },
    { label: 'Violet', style: 'violet' },
    { label: 'size', style: 'size' },
    { label: 'highlight', style: 'highlight' },
  ];

  const colorStyleMap = {
    red: {
      color: 'rgba(255, 0, 0, 1.0)',
    },
    orange: {
      color: 'rgba(255, 127, 0, 1.0)',
    },
    yellow: {
      color: 'rgba(180, 180, 0, 1.0)',
    },
    green: {
      color: 'rgba(0, 180, 0, 1.0)',
    },
    blue: {
      color: 'rgba(0, 0, 255, 1.0)',
    },
    indigo: {
      color: 'rgba(75, 0, 130, 1.0)',
    },
    violet: {
      color: 'rgba(127, 0, 255, 1.0)',
    },
    size: {
      fontSize: "100px",
    },
    highlight: {
      backgroundColor: '#faed27',
    }
  };


  const renderColors = () => {
    return COLORS.map((color, index) => {
      return (
        <button onClick={(e: any) => _toggle_color(color.style)} key={index} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>{color.label}</button>
      )
    });
  }

  return (
    <div className="m-0 p-0" onMouseEnter={focus} onClick={focus} onMouseLeave={blur}>
      <div className={(true) ? "sticky top-0 w-full border z-40 bg-white m-0" + theme_generate : "hidden" + theme_generate}>
        <button onClick={() => _toggleBlocStyle('ITALIC')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>I</button>
        <button onClick={() => _toggleBlocStyle('BOLD')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>B</button>
        <button onClick={() => _toggleBlocStyle('UNDERLINE')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>U</button>
        <button onClick={() => _toggleBlocStyle('CODE')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>C</button>
        <button onClick={() => _toggleBlockType('header-one')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>H1</button>
        <button onClick={() => _toggleBlockType('header-two')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>H2</button>
        <button onClick={() => _toggleBlockType('header-three')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>H3</button>
        <button onClick={() => _toggleBlockType('header-four')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>H4</button>
        <button onClick={() => _toggleBlockType('header-five')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>H5</button>
        <button onClick={() => _toggleBlockType('atomic')} className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>Test</button>
        <button className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>OL</button>
        <button className={"h-10 w-16 border border-t-0 border-b-0" + theme_generate}>UL</button>
        {renderColors()}
      </div>
      <Editor
        editorState={editorState}
        blockRenderMap={blockRenderMap}
        blockStyleFn={myBlockStyleFn}
        customStyleMap={colorStyleMap}
        placeholder="enter something"
        onChange={(e: any) => handleChange(e)}
        handleKeyCommand={handleKeyCommand}
        spellCheck={true}
        readOnly={false}
      />
    </div >
  );
}

export default HeaderText;
