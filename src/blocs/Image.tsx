import React, { useState, useEffect } from 'react'
import * as FilesAction from '../actions/filesAction';
import { useDispatch, useSelector } from 'react-redux';
import { IrootReducer } from '../reducers/rootReducer';
import src from '*.bmp';

const Image = (props: any) => {
    const { change, id, initState } = props;
    const dispatch = useDispatch();
    const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);
    const { last_file_imported } = useSelector((store: IrootReducer) => store.filesReducer);
    const [state, setState] = useState(initState);
    const [showControll, setShowControll] = useState(false);

    useEffect(() => {
        console.log({ state });
        change(id, state);
    }, [state])

    useEffect(() => {
        if (last_file_imported !== null) {
            setState((prevState: any) => {
                return { ...prevState, src: last_file_imported }
            });
        }
    }, [last_file_imported])

    const handleClick = () => {
        dispatch(FilesAction.import_media(project_path));
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
        <div className="bg-white w-full h-full relative flex flex-col" style={{ alignItems: state.align }} onMouseOver={handleMosueEnter} onMouseLeave={handleMouseLeave} onClick={handleMosueEnter}>
            <div className={(true) ? "absolute sticky top-0 left-0 text-black bg-white w-full border" : "hidden border-none"} >
                <div className="sticky top-0 w-full border border-b-0 border-t-0 z-40 bg-white">
                    <button onClick={() => handleClick()} className="h-10 w-32 border">Set Image</button>
                    <input onChange={handleWidthinput} placeholder="Enter Width" type="text" className="h-10 w-32 p-2" />
                    <input onChange={handleHeightInput} placeholder="Enter Height" type="text" className="h-10 w-32 p-2" />
                    <button onClick={() => handleAlign('flex-start')} className="h-10 w-32 border">Right</button>
                    <button onClick={() => handleAlign('center')} className="h-10 w-32 border">Center</button>
                    <button onClick={() => handleAlign('flex-end')} className="h-10 w-32 border">Left</button>
                </div>
            </div>
            <img className="rounded-lg" style={{ width: state.width, height: state.height, }} src={state.src} alt="image doesnt exist" />
        </div>
    )
}

export default Image
