import React, { useState, useEffect, useMemo } from 'react';
import path from 'path';
import Fuse from 'fuse.js';
import * as promptAction from '../actions/promptAction';
import { useSelector, useDispatch } from 'react-redux';

const Prompt = () => {
    const dispatch = useDispatch();

    /* ------------------------------ global state ------------------------------ */

    const { project_path } = useSelector((store: any) => store.filesReducer);
    const { folder_stack } = useSelector((store: any) => store.filesReducer);
    const { display } = useSelector((store: any) => store.promptReducer);

    /* ------------------------------- local state ------------------------------ */

    interface InitAction {
        title: string,
        item?: any,
        value?: any,
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
        includeMatches: false,
        findAllMatches: false,
        minMatchCharLength: 0,
        location: 0,
        threshold: 0.1,
        distance: 100,
        useExtendedSearch: false,
        keys: [
            "title",
            'key'
        ]
    };

    const initAction: Array<InitAction> = [
        {
            title: "create folder",
            key: 'crf',
            value: ['project_path', 'folder_stack'],
            mod: 'answer',
            value_mod: 'path',
            response: [
                {
                    title: "confirm",
                    key: 'cr',
                    value: [''],
                    response: [
                        {
                            title: "create",
                            key: 'cr',
                            value: [''],
                            fire: (answer: Array<string>) => {
                                dispatch(promptAction.create_folder(answer));
                                escape();
                            },
                        },
                        {
                            title: "cancel",
                            key: 'c',
                            value: [''],
                            fire: () => null,
                        }
                    ]
                },
                {
                    title: "cancel",
                    key: 'c',
                    value: ['value'],
                    fire: () => null,
                }
            ]
        },
        {
            title: "rename folder",
            key: 'rnf',
            mod: 'answer',
            value_mod: 'string',
            value: ['test'],
            response: [
                {
                    title: "confirm",
                    key: 'c',
                    value: ['_value', 'yes'],
                    fire: () => null,
                },
                {
                    title: "cancel",
                    key: 'c',
                    value: ['no'],
                    fire: () => null,
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
    /* --------------------------------- events --------------------------------- */

    const handleChange = (e: any) => {
        e.preventDefault();
        setValue(e.target.value);
        if (e.target.value === '') {
            setActionList(initAction);
        } else {
            if (answerMod === false) {
                const filteredActionList: Array<InitAction> = fuse?.search(value);
                setActionList(filteredActionList);
            }
        }
    }

    const handleKeyDown = (e: any) => {
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
    const escape = () => {
        setValue('');
        promptAction.dispatchToggleDisplay();
        setSelect(initAction);
        setAnswerStack([]);
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
    }

    /* --------------------------------- render --------------------------------- */
    const renderActionList = useMemo(() => {
        let render: Array<JSX.Element> = actionList.map((action: InitAction, index: number) => {
            if (action.item) {
                return (
                    <div key={index} className="auto shadow-md border p-2 text-gray-500 bg-gray-100 select-none cursor-pointer" onClick={() => action.item.fire()}>
                        <h1 className={(index === cursor) ? 'text-pink-900' : 'text-blue-600'}>{action.item.title}</h1>
                    </div>
                )
            } else {
                return (
                    <div key={index} className="auto shadow-md border p-2 text-gray-500 bg-gray-100 select-none cursor-pointer" onClick={() => action.item.fire()}>
                        <h1 className={(index === cursor) ? 'text-pink-900' : 'text-blue-600'}>{action.title}</h1>
                    </div>
                )
            }
        });
        return render;
    }, [actionList, cursor]);
    const renderBody = () => {
        if (display) {
            return (
                <div className={"w-2/6 h-12 bg-transparent mt-10"}>
                    <input autoFocus onKeyDown={((e: any) => handleKeyDown(e))} onChange={(e: any) => handleChange(e)} className="auto shadow-lg bg-gray-100 h-full w-full bg-white text p-2 border outline-none" value={value} type="text" />
                    {/* <div className="text-gray-500 text-center">{info}</div> */}
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
        <div className={`${(display) ? "absolute" : 'hidden'} w-full flex justify-center`}>
            {renderBody()}
        </div>
    );
}

export default React.memo(Prompt);
