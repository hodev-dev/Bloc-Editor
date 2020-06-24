import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IrootReducer } from '../reducers/rootReducer';
import * as blocAction from '../actions/blocAction';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as htmlToImage from 'html-to-image';
const ipcRenderer = window.require('electron').ipcRenderer;


const LinkPreview = (props: any) => {
    const { change, id, initState } = props;
    const [state, setState] = useState<any>(initState);
    const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);


    useEffect(() => {
        change(id, state);
    }, [state])

    useEffect(() => {
        ipcRenderer.on('linkPreview:get_data', (event: any, _link_data: any, _id: string, image_path: string) => {
            console.log({ _link_data });
            if (id === _id) {
                setState((prevState: any) => {
                    return {
                        ...prevState,
                        title: _link_data.title,
                        description: _link_data.description,
                        url: _link_data.og_url,
                        img: "file://" + image_path
                    }
                });
            }
        });
        return () => {
            ipcRenderer.removeAllListeners('linkPreview:get_data');
        }
    }, [])

    const handleFtechLink = () => {
        ipcRenderer.send('linkPreview:get_data', state.value, id, project_path);
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

    const handleToggleScreenshot = () => {
        setState((prevState: any) => {
            return {
                ...prevState,
                showScreenShot: !prevState.showScreenShot
            }
        });
    }

    return (
        <div className="flex flex-col">
            <div className={(true) ? "absolute sticky top-0 left-0 text-black bg-white w-full border" : "hidden border-none"} >
                <div className="sticky top-0 w-full border border-b-0 border-t-0 z-40 bg-white">
                    <input onChange={handleInput} value={(state && state.value) ? state.value : ''} className="w-64 h-10 font-light" type="text" />
                    <button onClick={handleFtechLink} className="h-10 w-32 border">Fetch Link Data</button>
                    <button onClick={handleCopy} className="h-10 w-32 border">Copy Link</button>
                    <button onClick={handleToggleScreenshot} className="h-10 w-40 border">Show Screenshot</button>
                </div>
            </div>
            <div className={(state.showScreenShot) ? "flex" : "hidden"}>
                <img className="object-cover h-full" src={(state && state.img) ? state.img : ''} alt="" />
            </div>
            <div className="flex flex-row w-full h-full bg-gray-100 p-1">
                <div className="w-2 h-32 bg-pink-900"> </div>
                <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-lg">
                    <img className="object-cover h-full" src={(state && state.img) ? state.img : ''} alt="" />
                </div>
                <div className="ml-3">
                    <h1 className="text-3xl font-semibold">{(state && state.title) ? state.title : "Title"}</h1>
                    <p className="font-sans p-2">{(state && state.description) ? state.description : 'description'}</p>
                </div>
            </div>
        </div >

    )
}

export default LinkPreview
