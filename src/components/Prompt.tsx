import React, { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import * as promptAction from '../actions/promptAction';
import { useSelector } from 'react-redux';
const Prompt = () => {
    interface InitAction {
        title: string,
        item?: any,
        response?: any
        placeholder?: string
        fire: () => any,
    }
    const fuseOptions = {
        isCaseSensitive: false,
        // includeScore: false,
        shouldSort: true,
        includeMatches: false,
        findAllMatches: false,
        minMatchCharLength: 5,
        location: 0,
        threshold: 0.2,
        distance: 100,
        useExtendedSearch: false,
        keys: [
            "title",
        ]
    };

    const initAction: Array<InitAction> = [
        {
            title: "create folder",
            placeholder: "please enter name of the command",
            fire: () => setValue('/advance/'),
            response: [
                {
                    title: 'create',
                    placeholder: "enter name of the folder and press \"yes\" to confirm",
                    value: true,
                    fire: () => setValue('yes'),
                },
                {
                    title: 'cancel',
                    placeholder: "enter name of the folder and press \"yes\" to confirm",
                    value: false,
                    fire: () => setValue('no')
                }
            ]
        },
        {
            title: "rename folder",
            placeholder: "please enter name of the command",
            fire: () => {
                console.log('rename fire');
            },
        },
    ]

    const [value, setValue] = useState('');
    const [info, setInfo] = useState('');
    const [select, setSelect] = useState<any | undefined>({});
    const [actionList, setActionList] = useState<Array<InitAction> | any>(initAction);
    const [fuse, setFuse] = useState<Array<InitAction> | any>();
    const [cursor, setCursor] = useState<number>(0);
    const [answerMod, setAnswerMod] = useState(false);
    const { display } = useSelector((store: any) => store.promptReducer);

    useEffect(() => {
        let fuse: Array<InitAction> | any = new Fuse(actionList, fuseOptions);
        setFuse(fuse);
        promptAction.listen();
        return () => {
            promptAction.unsubscribe();
        }
    }, []);

    useEffect(() => {
        console.log(display)
    }, [display]);

    useEffect(() => {
        if (actionList[cursor].item !== undefined) {
            setInfo(actionList[cursor].item.placeholder);
        } else {
            setInfo(actionList[cursor].placeholder);
        }
    }, [cursor, answerMod]);

    useEffect(() => {
        const response = select[0];
        if (response !== undefined) {
            setInfo(response.placeholder);
        }
    }, [select]);

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
            const listItem = (actionList[cursor].item) ? actionList[cursor].item : actionList[cursor];
            const { response } = listItem;
            if (response !== undefined) {
                setAnswerMod(true)
                console.log('else', listItem)
                listItem.fire();
                setActionList(response);
            } else {
                listItem.fire();
            }
        } else if (e.keyCode === 27) {
            setValue('');
            promptAction.dispatchToggleDisplay();
            setActionList(initAction);
        }
    }

    const handleClick = (e: any) => {
    }
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
                    <input autoFocus onClick={(e: any) => handleClick(e)} onKeyDown={((e: any) => handleKeyDown(e))} onChange={(e: any) => handleChange(e)} className="auto shadow-lg bg-gray-100 h-full w-full bg-white text p-2 border outline-none" value={value} type="text" />
                    <div className="text-gray-500 text-center">{info}</div>
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
