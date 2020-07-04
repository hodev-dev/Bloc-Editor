import React, { useState, useEffect } from 'react'
import * as FilesAction from '../actions/filesAction';
import { useDispatch, useSelector } from 'react-redux';
import { IrootReducer } from '../reducers/rootReducer';
import src from '*.bmp';
const ipcRenderer = window.require('electron').ipcRenderer;

const Image = (props: any) => {
    const { change, id, initState } = props;
    const dispatch = useDispatch();
    const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);
    const { last_file_imported } = useSelector((store: IrootReducer) => store.filesReducer);
    const [state, setState] = useState(initState);
    const [showControll, setShowControll] = useState(false);
    const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
    const theme_generate = ' ' + theme.default.bg + ' ' + theme.default.border + ' ' + theme.default.text;

    useEffect(() => {
        change(id, state);
    }, [state])


    const handleClick = () => {
        ipcRenderer.send('files:import_media', project_path, id);
        ipcRenderer.on('files:import_media_path', (event: any, last_file_imported_path: string, _id: string) => {
            if (id === _id) {
                setState((prevState: any) => {
                    return { ...prevState, src: last_file_imported_path }
                });
            }
        });
    }
    const handleWidthinput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return { ...prevState, width: Number(e.target.value) }
        });
    }

    const handleHeightInput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return { ...prevState, height: Number(e.target.value) }
        });
    }

    const handleAlign = (align: string) => {
        setState((prevState: any) => {
            return { ...prevState, align: String(align) }
        });
    }
    const handleMosueEnter = () => {
        setShowControll(true);
    }
    const handleMouseLeave = () => {
        setShowControll(false);
    }
    return (
        <div className={"bg-white w-full h-full relative flex flex-col min-h-screen" + theme_generate} style={{ alignItems: state.align }} onMouseOver={handleMosueEnter} onMouseLeave={handleMouseLeave} onClick={handleMosueEnter}>
            <div className={(true) ? "sticky top-0 left-0 text-black bg-white w-full border" + theme_generate : "hidden border-none"} >
                <div className={"sticky top-0 w-full border border-b-0 border-t-0 z-40 bg-white" + theme_generate}>
                    <button onClick={() => handleClick()} className={"h-10 w-32 border" + theme_generate}>Set Image</button>
                    <input onChange={handleWidthinput} placeholder="Enter Width" type="text" className={"h-10 w-32 p-2" + theme_generate} />
                    <input onChange={handleHeightInput} placeholder="Enter Height" type="text" className={"h-10 w-32 p-2" + theme_generate} />
                    <button onClick={() => handleAlign('flex-start')} className={"h-10 w-32 border" + theme_generate}>Right</button>
                    <button onClick={() => handleAlign('center')} className={"h-10 w-32 border" + theme_generate}>Center</button>
                    <button onClick={() => handleAlign('flex-end')} className={"h-10 w-32 border" + theme_generate}>Left</button>
                </div>
            </div>
            <img loading="lazy" className="rounded-lg" style={{ width: state.width + 'vw', height: state.height + 'vh', }} src={state.src} alt="image doesnt exist" />
        </div>
    )
}

export default Image
