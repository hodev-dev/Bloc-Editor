import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IrootReducer } from '../reducers/rootReducer';
import Colors from '../ui/themes/colors';
const ipcRenderer = window.require('electron').ipcRenderer;

const LinkPreview = (props: any) => {
    const { change, id, initState, lock } = props;
    const [state, setState] = useState<any>(initState);
    const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);
    const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
    const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;

    useEffect(() => {
        change(id, state);
    }, [state])

    useEffect(() => {
        setState((prevState: any) => {
            return {
                ...prevState,
                showColors: false
            }
        });
        return () => {
            ipcRenderer.removeAllListeners('linkPreview:get_data');
        }
    }, [])

    const handleFtechLink = () => {
        console.log("run");
        ipcRenderer.send('linkPreview:get_data', state.value, id, project_path);
        ipcRenderer.on('linkPreview:get_data', (event: any, _link_data: any, _id: string, image_path: string) => {
            console.log("run");
            if (id === _id) {
                setState((prevState: any) => {
                    return {
                        ...prevState,
                        title: _link_data.title,
                        description: _link_data.description,
                        url: _link_data.og_url,
                        img: "file://" + image_path,
                        loading: false,
                        html: _link_data.html
                    }
                });
            }
        });
        setState((prevState: any) => {
            return {
                ...prevState,
                loading: false
            }
        });
    }

    const handleInput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return {
                ...prevState,
                value: e.target.value
            }
        });
    }

    const handleCopy = () => {
        ipcRenderer.send('clipboard:add', state.value);
    }

    const handleSelectColor = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return {
                ...prevState,
                showColors: !prevState.showColors
            }
        });
    }

    const handleChangeColor = (color: string) => {
        console.log({ color });
        setState((prevState: any) => {
            return {
                ...prevState,
                thumbColor: color,
                showColors: false
            }
        });

    }
    const handTitleInput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return {
                ...prevState,
                cardTitle: e.target.value
            }
        });
    }
    const renderColors = () => {
        let color_array: Array<any> = [];
        Object.keys(Colors).map(key => {
            color_array.push(Colors[key]);
        });
        return color_array.map((color: any, index: number) => {
            return (
                <div className="flex w-full h-auto" key={index}>
                    <div onClick={() => handleChangeColor(color[900])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate} >
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[900] }}>{}</button>
                        <span>{color[900]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[800])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate} >
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[800] }}>{}</button>
                        <span>{color[800]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[700])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate} >
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[700] }}>{}</button>
                        <span>{color[700]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[600])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate} >
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[600] }}>{}</button>
                        <span>{color[600]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[500])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate} >
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[500] }}>{}</button>
                        <span>{color[500]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[400])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate} >
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[400] }}>{}</button>
                        <span>{color[400]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[300])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate}>
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[300] }}>{}</button>
                        <span>{color[300]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[200])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate}>
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[200] }}>{}</button>
                        <span>{color[200]}</span>
                    </div>
                    <div onClick={() => handleChangeColor(color[100])} className={"flex items-center justify-center w-2/12 p-2 border cursor-pointer" + theme_generate}>
                        <button className="w-4 h-4 m-2 text-black rounded-full" style={{ background: color[100] }}>{}</button>
                        <span>{color[100]}</span>
                    </div>
                </div>
            )
        });
    }

    return (
        <div className="relative flex flex-col h-auto">
            <div className={(!lock) ? "sticky z-10 top-0 left-0 text-black w-full max-w-full border " + theme_generate : "hidden border-none"} >
                <div className={"z-10 w-full aboslute"}>
                    <input onChange={handleInput} value={(state && state.value) ? state.value : ''} className={"z-20 w-64 h-10 font-light align-middle" + theme_generate} type="text" />
                    <input onChange={handTitleInput} value={(state && state.cardTitle) ? state.cardTitle : ''} className={"z-20 w-64 h-10 font-light align-middle" + theme_generate} type="text" />
                    <button onClick={handleFtechLink} className={(false) ? 'hidden' : "h-10 w-32 border align-middle" + theme_generate}>
                        <span>Fetch Link Data</span>
                    </button>
                    <button disabled className={(state.loading) ? "h-10 w-32 border align-middle" + theme_generate : "hidden"}>
                        <svg style={{ animation: "spin 3s linear infinite" }} className="w-32 h-6 text-pink-900 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m45 300.007812c-24.8125 0-45-20.1875-45-45s20.1875-45 45-45c24.816406 0 45.003906 20.1875 45.003906 45s-20.1875 45-45.003906 45zm192.007812-200.003906c-27.570312 0-50.003906-22.429687-50.003906-50.003906 0-27.570312 22.433594-50 50.003906-50 27.570313 0 50 22.429688 50 50 0 27.574219-22.429687 50.003906-50 50.003906zm0-60.003906c-5.515624 0-10 4.488281-10 10 0 5.515625 4.484376 10 10 10 5.511719 0 10-4.484375 10-10 0-5.511719-4.488281-10-10-10zm-136.503906 122.003906c-12.957031 0-25.136718-5.042968-34.296875-14.207031-9.160156-9.160156-14.207031-21.339844-14.207031-34.292969 0-12.957031 5.046875-25.136718 14.207031-34.296875 9.160157-9.160156 21.339844-14.207031 34.296875-14.207031 12.953125 0 25.132813 5.046875 34.296875 14.207031h-.003906.003906c9.160157 9.160157 14.203125 21.339844 14.203125 34.296875 0 12.953125-5.042968 25.132813-14.207031 34.296875-9.160156 9.160157-21.339844 14.203125-34.292969 14.203125zm0-57c-1.316406 0-3.84375.320313-6.011718 2.488282-2.167969 2.167968-2.488282 4.695312-2.488282 6.011718s.320313 3.84375 2.488282 6.007813c2.167968 2.167969 4.695312 2.492187 6.011718 2.492187 1.3125 0 3.84375-.324218 6.007813-2.488281 2.167969-2.167969 2.492187-4.695313 2.492187-6.011719s-.324218-3.84375-2.488281-6.011718h-.003906c-2.164063-2.167969-4.695313-2.488282-6.007813-2.488282zm282.007813 59c-14.824219 0-28.761719-5.773437-39.246094-16.253906-10.484375-10.484375-16.257813-24.421875-16.257813-39.246094 0-14.824218 5.773438-28.761718 16.257813-39.246094 10.484375-10.484374 24.421875-16.257812 39.246094-16.257812s28.761719 5.773438 39.246093 16.257812c10.480469 10.484376 16.253907 24.421876 16.253907 39.246094 0 14.824219-5.773438 28.761719-16.253907 39.246094-10.484374 10.480469-24.421874 16.253906-39.246093 16.253906zm0-71c-4.140625 0-8.03125 1.609375-10.960938 4.539063-2.925781 2.929687-4.539062 6.820312-4.539062 10.960937s1.609375 8.03125 4.539062 10.957032c2.929688 2.929687 6.820313 4.542968 10.960938 4.542968s8.03125-1.613281 10.957031-4.539062c2.929688-2.929688 4.542969-6.820313 4.542969-10.960938s-1.613281-8.03125-4.542969-10.960937c-2.925781-2.929688-6.816406-4.539063-10.957031-4.539063zm64.5 225.976563c-16.644531 0-33.289063-6.335938-45.960938-19.007813-25.347656-25.34375-25.347656-66.585937 0-91.929687 25.34375-25.34375 66.582031-25.34375 91.925781 0s25.34375 66.585937 0 91.929687c-12.671874 12.671875-29.316406 19.007813-45.964843 19.007813zm0-89.960938c-6.402344 0-12.804688 2.4375-17.675781 7.308594-9.75 9.75-9.75 25.609375 0 35.359375 9.746093 9.746094 25.605468 9.746094 35.355468 0 9.746094-9.75 9.746094-25.609375 0-35.359375-4.875-4.871094-11.277344-7.308594-17.679687-7.308594zm-64 255.960938c-17.671875 0-35.339844-6.722657-48.792969-20.175781-26.902344-26.902344-26.902344-70.679688 0-97.582032 26.902344-26.90625 70.679688-26.90625 97.582031 0 26.90625 26.902344 26.90625 70.679688 0 97.582032-13.449219 13.453124-31.121093 20.175781-48.789062 20.175781zm0-97.957031c-7.425781 0-14.851563 2.828124-20.507813 8.480468-11.304687 11.308594-11.304687 29.707032 0 41.015625 11.308594 11.308594 29.707032 11.308594 41.015625 0 11.304688-11.308593 11.304688-29.707031 0-41.015625-5.65625-5.652344-13.082031-8.480468-20.507812-8.480468zm-290.511719 51.96875c-11.136719 0-22.277344-4.242188-30.757812-12.71875-16.960938-16.964844-16.960938-44.5625 0-61.523438 16.960937-16.960938 44.558593-16.960938 61.519531 0 16.960937 16.960938 16.960937 44.558594 0 61.519531-8.480469 8.480469-19.621094 12.722657-30.761719 12.722657zm117.503906 73.007812c-7.683594 0-15.363281-2.921875-21.210937-8.769531-11.699219-11.699219-11.699219-30.734375-.003907-42.429688l.003907-.003906c11.695312-11.695313 30.730469-11.695313 42.425781 0 11.699219 11.699219 11.699219 30.734375.003906 42.429687-5.851562 5.847657-13.535156 8.773438-21.21875 8.773438zm0 0" /></svg>
                    </button>
                    <button onClick={handleCopy} className={"w-32 h-10 align-middle border" + theme_generate}>Copy Link</button>
                    <button onClick={handleSelectColor} className={"w-32 h-10 align-middle border" + theme_generate}>select</button>
                </div>

            </div>
            <div className={(state.showColors) ? "w-full h-full border border-b-0" + theme_generate : "hidden"}>
                {renderColors()}
            </div>
            <div className={"flex flex-row w-full h-32 p-1"}>
                <div className={"flex items-center justify-center w-2/12 h-32 border rounded-lg" + theme_generate}>
                    <div className="flex items-center justify-center w-full h-32 overflow-hidden text-4xl font-semibold text-gray-300 " style={{ background: state.thumbColor }}>{state.cardTitle}</div>
                </div>
                <div className={"w-8/12 ml-3 " + ' ' + theme.default.bgc}>
                    <h1 className="text-3xl font-semibold">{(state && state.title) ? state.title : "Title"}</h1>
                    <p className="p-2 font-sans">{(state && state.description) ? state.description : 'description'}</p>
                </div>
            </div>
        </div >

    )
}

export default LinkPreview;
