import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IrootReducer } from '../reducers/rootReducer';
import ReactPlayer from 'react-player'

export const Video = (props: any) => {
    const { change, id, initState, lock } = props;
    const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
    const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;
    const [state, setState] = useState(initState) as any;

    useEffect(() => {
        change(id, state);
    }, [state])

    const handelUrlInput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return {
                ...prevState,
                url: e.target.value
            }
        })
    }

    return (
        <div className="relative flex flex-col h-auto outline-none">
            <div className={(true) ? "sticky z-10 top-0 left-0 text-black w-full max-w-full border " + theme_generate : "hidden border-none"} >
                <div className={"z-10 w-full aboslute"}>
                    <input placeholder={"enter video url"} onChange={handelUrlInput} value={(state.url) ? state.url : ''} className={"z-20 w-6/12 h-10 font-light align-middle" + theme_generate} type="text" />
                </div>
            </div>
            <div className={"flex flex-row items-center justify-center outline-none"}>
                <ReactPlayer
                    controls={true}
                    light={true}
                    style={{ outline: 'none' }}
                    url={state.url}
                    width='100%'
                    height='50vh'
                    config={{
                        youtube: {
                            playerVars: { showinfo: 1 }
                        },
                    }}
                />
            </div>
        </div >

    )
}
