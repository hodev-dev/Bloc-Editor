import React, { useState, useEffect, useMemo } from 'react';
import path from 'path';
import Fuse from 'fuse.js';
import * as promptAction from '../../actions/promptAction';
import * as filesAction from '../../actions/filesAction';
import { useSelector, useDispatch } from 'react-redux';
import { IrootReducer } from '../../reducers/rootReducer';
import * as themeAction from '../../actions/themeAction';


const Prompt = () => {
    const dispatch = useDispatch();

    /* ------------------------------ global state ------------------------------ */

    const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);
    const { folder_stack } = useSelector((store: IrootReducer) => store.filesReducer);
    const { display } = useSelector((store: IrootReducer) => store.promptReducer);
    const { select_action } = useSelector((store: IrootReducer) => store.promptReducer);
    const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
    const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;
    /* ------------------------------- local state ------------------------------ */

    interface InitAction {
        title: string,
        item?: any,
        value?: any,
        info?: any,
        key: string,
        value_mod?: string,
        mod?: string,
        fire?: (value: Array<string>) => void;
        response?: Array<InitAction>
    }
    const fuseOptions = {
        isCaseSensitive: false,
        // includeScore: false,
        shouldSort: true,
        includeMatches: true,
        findAllMatches: true,
        minMatchCharLength: 3,
        location: 0,
        threshold: 0.1,
        distance: 100,
        useExtendedSearch: true,
        keys: [
            'title'
        ]
    };

    const initAction: Array<InitAction> = [
        {
            title: "create folder",
            key: 'crf',
            info: 'Create Folder:',
            value: ['project_path', 'folder_stack'],
            mod: 'answer',
            value_mod: 'path',
            response: [
                {
                    title: "confirm",
                    key: 'cr',
                    info: 'Enter Path To Create Folder:',
                    value: [''],
                    response: [
                        {
                            title: "create",
                            key: 'cr',
                            info: 'Enter Folder Name:',
                            value: [''],
                            fire: (answer: Array<string>) => {
                                dispatch(promptAction.create_folder(answer));
                                escape();
                            },
                        },
                        {
                            title: "cancel",
                            key: 'c',
                            info: 'Cancel:',
                            value: [''],
                            fire: () => escape(),
                        }
                    ]
                },
                {
                    title: "cancel",
                    info: 'Cancel:',
                    key: 'c',
                    value: ['value'],
                    fire: () => escape(),
                }
            ]
        },
        {
            title: "create bloc",
            key: 'crb',
            info: 'Create Bloc File:',
            mod: 'answer',
            value_mod: 'string',
            value: [''],
            response: [
                {
                    title: "confirm",
                    key: 'c',
                    info: 'Enter Bloc File Name:',
                    value: ['_value'],
                    fire: (answer: Array<string>) => {
                        dispatch(filesAction.create_file(answer));
                        escape();
                    },
                },
                {
                    title: "cancel",
                    key: 'c',
                    info: 'Cancel:',
                    value: [''],
                    fire: (answer: Array<string>) => escape,
                }
            ]
        },
        {
            title: "hide/show explorer",
            key: 'tge',
            info: 'hide/show explorer visibility:',
            mod: 'answer',
            value_mod: 'string',
            value: [''],
            fire: () => { dispatch(filesAction.toggleDisplay()); escape() }
        },
        {
            title: "change theme",
            key: 'cht',
            info: 'Select Theme:',
            mod: 'answer',
            value_mod: 'string',
            value: [''],
            response: [
                {
                    title: "light",
                    key: 'l',
                    info: 'light',
                    value: [''],
                    fire: (answer: Array<string>) => {
                        dispatch(themeAction.set_theme("SET_LIGHT"));
                        dispatch(promptAction.set_theme('SET_LIGHT'));
                        escape();
                    },
                },
                {
                    title: "dark",
                    key: 'd',
                    info: 'dark',
                    value: [''],
                    fire: (answer: Array<string>) => {
                        dispatch(themeAction.set_theme("SET_DARK"));
                        dispatch(promptAction.set_theme('SET_DARK'));
                        escape();
                    },
                }
            ]
        },
    ]

    const [actionList, setActionList] = useState<Array<InitAction> | any>(initAction);
    const [value, setValue] = useState('');
    const [answerStack, setAnswerStack] = useState<Array<string>>([]);
    const [select, setSelect] = useState<Array<InitAction> | any>();
    const [fuse, setFuse] = useState<Array<InitAction> | any>();
    const [cursor, setCursor] = useState<number>(0);
    const [depth, setDepth] = useState<number>(0);
    const [answerMod, setAnswerMod] = useState(false);

    useEffect(() => {
        let fuse: Array<InitAction> | any = new Fuse(actionList, fuseOptions);
        setFuse(fuse);
        promptAction.listen();
        return () => {
            promptAction.unsubscribe();
        }
    }, []);

    useEffect(() => {
        if (select) {
            setActionList(select);
        }
    }, [select, value]);

    useEffect(() => {
        // set value to empty when display mod change
        setValue('');
    }, [display])

    useEffect(() => {
        // listen to change key of list and enter that key
        if (select_action) {
            actionList.forEach((action: any) => {
                if (action.key === select_action) {
                    enter(action)
                    setAnswerStack([]);
                    promptAction.display(true);
                }
            });
        }
    }, [select_action, value]);


    /* --------------------------------- events --------------------------------- */

    const handleChange = (e: any) => {
        // two way data binding for input and update fuzzy search
        e.preventDefault();
        setValue(e.target.value);
        if (e.target.value === '') {
            setSelect(initAction);
        } else {
            if (answerMod === false) {
                const filteredActionList: Array<InitAction> = fuse?.search(value);
                setSelect(filteredActionList);
                setActionList(filteredActionList)
            }
        }
    }

    const handleKeyDown = (e: any) => {
        // handle arrow up and arrow down key
        if (e.keyCode === 38 && cursor > 0) {
            e.preventDefault();
            setCursor((prevCursor) => prevCursor - 1);
        } else if (e.keyCode === 40 && cursor < actionList.length - 1) {
            e.preventDefault();
            setCursor((prevCursor) => prevCursor + 1);
        } else if (e.keyCode === 13) {
            const cmd = (actionList[cursor].item) ? actionList[cursor].item : actionList[cursor];
            enter(cmd);
        } else if (e.keyCode === 27) {
            escape();
        }
    }

    const generated_value = (cmd: InitAction) => {
        let temp: Array<string> = [];
        let _value: string = '';
        cmd.value.map((key: any) => {
            if (key === 'project_path') {
                temp.push(project_path);
            }
            else if (key === 'folder_stack') {
                temp.push(...folder_stack)
            }
            else if (key === '_value') {
                temp.push(value);
            } else if (key === '') {
                temp = [];
            } else {
                temp.push(...cmd.value);
            }
        });
        // middleware
        if (cmd.value_mod && cmd.value_mod === "path") {
            _value = path.join(...temp, '/');
        } else {
            temp = temp.filter((filter_item) => filter_item !== '_value');
            _value = temp.join();
        }
        temp = [];
        return _value;
    }

    const enter = (cmd: InitAction) => {
        if (value !== '') {
            answerStack.push(value);
        }
        let gv = '';
        if (cmd.mod === 'answer') {
            setAnswerMod(true);
        }
        if (cmd && cmd.fire) {
            cmd.fire(answerStack);
        }
        if (cmd.response) {
            setSelect(cmd.response);
            gv = generated_value(cmd);
        } else {
            gv = generated_value(cmd);
        }
        setValue(gv);
        setDepth(depth + 1);
        setCursor(0);
    }

    const escape = () => {
        promptAction.dispatchToggleDisplay();
        setSelect(initAction);
        setAnswerStack([]);
        setAnswerMod(false);
        setCursor(0);
        setValue('');
        dispatch(promptAction.set_select(''));
    }

    const normalize_actionlist = () => {
        return (actionList[cursor] && actionList[cursor].item !== undefined) ? actionList[cursor].item.info : (actionList[cursor] !== undefined) ? actionList[cursor].info : '';
    }

    /* --------------------------------- render --------------------------------- */
    const renderActionList = useMemo(() => {
        let render: Array<JSX.Element> = actionList.map((action: InitAction, index: number) => {
            if (action.item) {
                return (
                    <div key={index} className={(index === cursor) ? "auto border border-pink-700 mt-2 p-2 text-gray-500 bg-pink-100 select-none cursor-pointer" + theme_generate : "auto border mt-2 p-2 text-gray-500 select-none cursor-pointer" + theme_generate}>
                        <h1 className={(index === cursor) ? 'text-pink-900' : 'text-gray-600'}>{action.item.title}</h1>
                    </div>
                )
            } else {
                return (
                    <div key={index} className={(index === cursor) ? "auto border border-pink-700 mt-2 p-2 text-gray-500 bg-pink-100 select-none cursor-pointer" + theme_generate : "auto border mt-2 p-2 text-gray-500 bg-gray-100 select-none cursor-pointer" + theme_generate}>
                        <h1 className={(index === cursor) ? 'text-pink-900' : 'text-gray-600'}>{action.title}</h1>
                    </div>
                )
            }
        });
        return render;
    }, [actionList, cursor]);

    const renderBody = () => {
        if (display) {
            return (
                <div className={"w-2/6 h-12 mt-10 bg-transparent"}>
                    <div className="text-left text-gray-500">{normalize_actionlist()}</div>
                    <input autoFocus onKeyDown={((e: any) => handleKeyDown(e))} onChange={(e: any) => handleChange(e)} className={"w-full h-full p-2 bg-white bg-gray-100 border rounded outline-none auto text" + theme_generate} value={value} type="text" />
                    <div className="mt-3">
                        {renderActionList}
                    </div>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }

    return (
        <div className={`${(display) ? "absolute z-50" : 'hidden'} w-full flex justify-center`}>
            {renderBody()}
        </div>
    );
}

export default React.memo(Prompt);
