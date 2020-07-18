import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator, ContentBlock, Modifier } from 'draft-js';
import Immutable from 'immutable';
import "draft-js/dist/Draft.css";
import { IrootReducer } from '../reducers/rootReducer';



const HeaderText = (props: any) => {

  const { change, id, initState } = props;
  const [editorState, setEditorState] = useState({ state: EditorState.createEmpty() }) as any;
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
    var init: any;
    if (initState && initState.raw && initState.state === null) {
      console.log('conver from raw');
      const raw = convertFromRaw(initState.raw);
      init = EditorState.createWithContent(raw);
    } else {
      init = EditorState.createEmpty();
    }
    setEditorState((prevState: any) => {
      return {
        ...prevState,
        state: init,
        raw: ''
      }
    });
  }, [])

  useEffect(() => {
    console.log({ editorState });
  }, [editorState])

  const handleChange = (editorState: any) => {
    const rawState: any = convertToRaw(editorState.getCurrentContent());
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    setEditorState((prevState: any) => {
      return {
        ...prevState,
        state: editorState,
        raw: rawState,
        value: value
      }
    });
    change(id, { state: null, raw: rawState, value: value });
  }

  const update = (newState: any) => {
    setEditorState((prevState: any) => {
      return {
        ...prevState,
        state: newState,
        raw: ''
      }
    });
  }

  const handleKeyCommand = (command: any) => {
    const newState = RichUtils.handleKeyCommand(editorState.state, command)
    if (newState) {
      update(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  const _toggleBlockType = (blockType: string) => {
    update(RichUtils.toggleBlockType(editorState.state, blockType));
  }

  const _toggleBlocStyle = (blocStyle: string) => {
    update(RichUtils.toggleInlineStyle(editorState.state, blocStyle));
  }
  return (
    <div className="p-0 m-0">
      <div className={(true) ? "sticky top-0 w-full border z-40 bg-white m-0" + theme_generate : "hidden" + theme_generate}>
        <button onClick={() => _toggleBlocStyle('ITALIC')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>I</button>
        <button onClick={() => _toggleBlocStyle('BOLD')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>B</button>
        <button onClick={() => _toggleBlocStyle('UNDERLINE')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>U</button>
        <button onClick={() => _toggleBlocStyle('CODE')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>C</button>
        <button onClick={() => _toggleBlockType('header-one')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>H1</button>
        <button onClick={() => _toggleBlockType('header-two')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>H2</button>
        <button onClick={() => _toggleBlockType('header-three')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>H3</button>
        <button onClick={() => _toggleBlockType('header-four')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>H4</button>
        <button onClick={() => _toggleBlockType('header-five')} className={"w-16 h-10 border border-t-0 border-b-0" + theme_generate}>H5</button>
      </div>
      <Editor
        editorState={editorState.state}
        blockRenderMap={blockRenderMap}
        blockStyleFn={myBlockStyleFn}
        placeholder=""
        onChange={(e: any) => handleChange(e)}
        handleKeyCommand={handleKeyCommand}
        spellCheck={true}
        readOnly={false}
      />
    </div >
  );
}

export default HeaderText;
