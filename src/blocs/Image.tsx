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
    const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;

    useEffect(() => {
        change(id, state);
    }, [state])


    const handleClick = () => {
        ipcRenderer.send('files:import_media', project_path, id);
        ipcRenderer.on('files:import_media_path', (event: any, base64_image_data: string, _id: string) => {
            if (id === _id) {
                setState((prevState: any) => {
                    return { ...prevState, src: base64_image_data }
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
        <div className={"relative flex flex-col w-full h-full min-h-screen bg-white" + theme_generate} style={{ alignItems: state.align }} onMouseOver={handleMosueEnter} onMouseLeave={handleMouseLeave} onClick={handleMosueEnter}>
            <div className={(true) ? "sticky top-0 left-0 text-black bg-white w-full border" + theme_generate : "hidden border-none"} >
                <div className={"sticky top-0 z-40 w-full bg-white border border-t-0 border-b-0" + theme_generate}>
                    <button onClick={() => handleClick()} className={"w-32 h-10 border" + theme_generate}>Set Image</button>
                    <input onChange={handleWidthinput} placeholder="Enter Width" type="text" className={"w-32 h-10 p-2" + theme_generate} />
                    <input onChange={handleHeightInput} placeholder="Enter Height" type="text" className={"w-32 h-10 p-2" + theme_generate} />
                    <button onClick={() => handleAlign('flex-start')} className={"w-32 h-10 border" + theme_generate}>Right</button>
                    <button onClick={() => handleAlign('center')} className={"w-32 h-10 border" + theme_generate}>Center</button>
                    <button onClick={() => handleAlign('flex-end')} className={"w-32 h-10 border" + theme_generate}>Left</button>
                </div>
            </div>
            <img loading="lazy" className="rounded-lg" style={{ width: state.width + 'vw', height: state.height + 'vh', }} src={"data:image/png;base64," + state.src} alt="image doesnt exist" />
        </div>
    )
}

export default Image
