import React, { useState, useEffect } from 'react';
import ActionBar from '../components/ActionBar';
import Explorer from '../components/Explorer';
import BlockEditor from '../components/BlockEditor';
import Prompt from '../components/Prompt';

import { useSelector, useDispatch } from 'react-redux';
import { getProjectFolderPath, selectProjectFolderPath, updateList, changeFolder, changeFolderBack } from '../actions/explorerAction';

const Editor = () => {

    const dispatch = useDispatch();
    /* ------------------------------ global state ------------------------------ */

    let { initialExplorer } = useSelector((store: any) => store.explorerReducer);
    const { projectPath } = useSelector((store: any) => store.explorerReducer);
    const { visible } = useSelector((store: any) => store.explorerReducer);
    const { folderName } = useSelector((store: any) => store.explorerReducer);
    const { folderStack } = useSelector((store: any) => store.explorerReducer);

    /* ------------------------------- local state ------------------------------ */
    const [isProjectPathExists, setIsProjectPathExists] = useState(false);
    const [folderNameState, setFolderNameState] = useState(folderName)
    const [folderStackState, setFolderStackState] = useState(folderStack);

    useEffect(() => {
        if (!projectPath) {
            dispatch(getProjectFolderPath());
        }
        if (projectPath !== undefined && projectPath !== '') {
            setIsProjectPathExists(true);
        }
        if (folderName === '') {
            const normalizedPath = projectPath.substring(1, projectPath.length - 1);
            dispatch(updateList({ "projectPath": normalizedPath, "folderName": folderNameState, "fullPath": normalizedPath }));
        }
    }, [projectPath]);

    useEffect(() => {
        dispatch(changeFolder({ "projectPath": projectPath, "folderName": folderNameState, 'stackFolder': folderStackState }));
    }, [folderNameState,folderStackState]);


    /* -------------------------------- callbacks ------------------------------- */

    const setProjectFolderClick = () => {
        dispatch(selectProjectFolderPath());
    }

    const onClickItemExplorer = (item: any) => {
        if (item.title === 'Back') {
            folderStackState.pop();
            dispatch(changeFolderBack({ "projectPath": projectPath, "folderName": folderNameState, "stackFolder": folderStackState }));
        } else if (item.title.includes('.')) {
        } else {
            if (projectPath !== '' && projectPath !== undefined && !item.title.includes('.')) {
                setFolderStackState((state: Array<string>) => {
                    const lastitem = (state.length > 0) ? state.length - 1 : state.length;
                    if (state[lastitem] !== item.title) {
                        return [...state, item.title]
                    }
                    return [...state];
                });
                setFolderNameState(item.title);
            }
        }
    }

    const onCreateFolderCallBack = () => {

    }

    /* --------------------------------- render --------------------------------- */

    return (
        <div className="flex justify-center min-h-screen">
            <ActionBar />
            <Explorer
                folderStack={folderStackState}
                initMenu={initialExplorer}
                visible={visible}
                isProjectPathExists={isProjectPathExists}
                setProjectFolderClick={setProjectFolderClick}
                onClickItemExplorer={onClickItemExplorer}
                onCreateFolderCallBack={onCreateFolderCallBack}
            />
            <BlockEditor />
            <Prompt />
        </div>
    );
}

export default Editor;
