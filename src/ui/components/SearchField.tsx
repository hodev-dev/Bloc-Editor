import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { IrootReducer } from '../../reducers/rootReducer';
const ipcRenderer = window.require('electron').ipcRenderer;

const SearchField = () => {
    const [state, setState] = useState();
    const [result, setResult] = useState([]);
    const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);


    useEffect(() => {
        ipcRenderer.on('searchField:search', updateState);
        return () => {
            ipcRenderer.removeListener("searchField:search", updateState);
        }
    }, []);

    const updateState = (event: any, search_result: any) => {
        setResult(search_result);
    };

    const handleSearch = (e: any) => {
        setState(e.target.value);
        if (e.target.value === '') {
            setResult([]);
        }
    }

    const handleClick = () => {
        ipcRenderer.send('searchField:search', state, project_path);
    }

    const renderResult = (): Array<JSX.Element> | JSX.Element => {
        if (result.length > 0) {
            return result.map((res, index: number) => {
                return (
                    <div key={index} className="w-full bg-white border p-4">{res}</div>
                )
            });
        }
        return (
            <div className="w-full bg-white border p-4">No File Found</div>
        )
    }

    return (
        <div className="flex flex-col w-full bg-gray-200 items-center">
            <div className="flex flex-row w-3/6 p-5">
                <input onChange={handleSearch} type="text" className="w-10/12 h-12 border text-3xl" />
                <button onClick={handleClick} className="w-2/12 h-12 bg-white border">Search</button>
            </div>
            <div className="w-full pr-40 pl-40">
                <h1 className="p-2">Files</h1>
                {renderResult()}
            </div>
        </div >
    )
}

export default SearchField
