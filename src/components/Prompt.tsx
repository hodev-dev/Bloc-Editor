import React, { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import { fireEvent } from '@testing-library/react';

const Promp = () => {
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
        threshold: 0.6,
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

    const inputref = useRef<any | null>(null);
    const [value, setValue] = useState('');
    const [info, setInfo] = useState('');
    const [select, setSelect] = useState<any | undefined>({});
    const [actionList, setActionList] = useState<Array<InitAction> | any>(initAction);
    const [fuse, setFuse] = useState<Array<InitAction> | any>();
    const [cursor, setCursor] = useState<number>(0);
    const [answerMod, setAnswerMod] = useState(false);

    useEffect(() => {
        let fuse: Array<InitAction> | any = new Fuse(actionList, fuseOptions);
        setFuse(fuse);
        inputref.current.focus();
    }, []);

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
            const listItem =   (actionList[cursor].item) ? actionList[cursor].item : actionList[cursor];
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
            setAnswerMod(false);
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

    return (
        <div className="absolute w-2/6 h-12 bg-transparent mt-10">
            <input onClick={(e: any) => handleClick(e)} onKeyDown={((e: any) => handleKeyDown(e))} onChange={(e: any) => handleChange(e)} className="auto shadow-lg bg-gray-100 h-full w-full bg-white text p-2 border outline-none" ref={inputref} value={value} type="text" />
            <div className="text-gray-500 text-center">{info}</div>
            <div className="mt-3">
                {renderActionList}
            </div>
        </div>
    );
}

export default React.memo(Promp);
