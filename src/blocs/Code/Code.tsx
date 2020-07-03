import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import AceEditor from "react-ace";
import "./themes";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-code_lens"
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-linking";
import ace from "ace-builds";
import beautify from "ace-builds/src-noconflict/ext-beautify";
import theme_list from "ace-builds/src-noconflict/ext-themelist";
import modelist from "ace-builds/src-noconflict/ext-modelist";
import { IrootReducer } from '../../reducers/rootReducer';


export const Code = (props: any) => {
    const { id, change, initState } = props;
    const [state, setState] = useState(initState);
    const [themeList, setThemeList] = useState(theme_list);
    const [editor, setEditor] = useState<any>();
    const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
    const theme_generate = ' ' + theme.default.bg + ' ' + theme.default.border + ' ' + theme.default.text;

    useEffect(() => {
        var _initeditor = ace.edit("editor");
        setEditor(_initeditor);
    }, [])

    useEffect(() => {
        console.log({ modelist });
        change(id, state);
    }, [state])

    useEffect(() => {
        setState(initState);
    }, [initState])

    useEffect(() => {
        setThemeList(theme_list)
    }, [theme_list])

    const onChange = (newState: any) => {
        setState((prevState: any) => {
            return {
                ...prevState,
                value: newState
            }
        });
    }

    const handleSelectTheme = (e: any) => {
        if (e.target !== null) {
            setState((prevState: any) => {
                return {
                    ...prevState,
                    selectedTheme: e.target.value
                }
            });
        }
        e.persist();
    }

    const handleSelectLanguage = (e: any) => {
        if (e.target !== null) {
            setState((prevState: any) => {
                return {
                    ...prevState,
                    language: e.target.value
                }
            });
        }
        e.persist();
    }

    const handleFontSize = (e: any) => {
        if (e.target !== null) {
            setState((prevState: any) => {
                return {
                    ...prevState,
                    fontSize: Number(e.target.value)
                }
            });
        }
        e.persist();
    }
    const handleInput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return {
                ...prevState,
                height: Number(e.target.value)
            }
        });
    }
    const renderThemeList = (): Array<JSX.Element> => {
        return Object.keys(themeList['themes']).map(function (key, index) {
            console.log();
            return (
                <option key={index} value={themeList['themes'][key]['name']}>{themeList['themes'][key]['name']}</option>
            )
        });
    }

    const renderLanguageList = (): Array<JSX.Element> => {
        return Object.keys(modelist['modesByName']).map(function (key, index) {
            console.log();
            return (
                <option key={index} value={modelist['modesByName'][key]['name']}>{modelist['modesByName'][key]['name']}</option>
            )
        });
    }

    const renderFontSize = () => {
        let arr = [];
        let l: number = 4;
        let r: number = 64;
        while (l <= r) {
            arr.push(l);
            l += 2;
        };
        return arr.map((fontSize: number, index: number) => {
            return (
                <option key={index} value={Number(fontSize)}>{Number(fontSize)}</option>
            )
        })
    }

    const formatCode = () => {
        beautify.beautify(editor.session);
    }
    return (
        <div className="flex flex-col">
            <div className={(true) ? "sticky top-0 left-0 border text-black bg-white w-full" + ' ' + theme.default.border : "hidden border-none"} >
                <div className={"sticky top-0 w-full border border-b-0 border-t-0 z-40" + theme_generate}>
                    <label className="p-2" htmlFor="">theme</label>
                    <select onChange={(e) => handleSelectTheme(e)} className={"w-64 h-10 font-light align-middle bg-white" + theme_generate} name="themes" id="themes">
                        {renderThemeList()}
                    </select>
                    <label className="p-2" htmlFor="">font-size</label>
                    <select onChange={(e) => handleFontSize(e)} className={"w-32 h-10 font-light align-middle bg-white" + theme_generate} name="fontSize" id="fontSize">
                        {renderFontSize()}
                    </select>
                    <label className="p-2" htmlFor="">Language</label>
                    <select onChange={handleSelectLanguage} className={"w-64 h-10 font-light align-middle bg-white" + theme_generate} name="cars" id="cars">
                        {renderLanguageList()}
                    </select>
                    <label className="p-2" htmlFor="">Height</label>
                    <input placeholder="Enter Number Of Height" onChange={handleInput} value={(state && state.height) ? state.height : ''} className={"w-64 h-10 font-light align-middle" + theme_generate} type="text" />
                    <button onClick={formatCode} className={"h-10 w-32 border align-middle" + theme_generate}>Format Code</button>
                </div>
            </div>

            <AceEditor
                mode={(state.language) ? state.language : "java"}
                theme={(state.selectedTheme) ? state.selectedTheme : "xcode"}
                onChange={onChange}
                name={"editor"}
                width={'100%'}
                height={(state.height) ? state.height + 'vh' : '50vh'}
                className="flex overflow-auto"
                editorProps={{ $blockScrolling: false }}
                fontSize={(state.fontSize) ? state.fontSize : "24"}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                enableSnippets={true}
                defaultValue={(state.value) ? state.value : ""}
            />
        </div>
    )
}
