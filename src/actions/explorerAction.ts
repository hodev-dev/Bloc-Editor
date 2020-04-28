const ipcRenderer = window.require('electron').ipcRenderer;


const setRootFolder = (folderName: string, fullPath: string) => {
    return function (dispatch: any) {
        dispatch({
            "type": "UPDATE_ROOT_FOLDER",
            "payload": {
                rootFolder: fullPath,
                folderName: folderName
            }
        });
    }
}

/* ------------ read and set project patch base on local setting ------------ */
const getProjectFolderPath = () => {
    return function (dispatch: any) {
        ipcRenderer.send('explorer:getProjectPath');
        ipcRenderer.on('explorer:setProjectPath', (event: any, projectPath: any) => {
            if (projectPath !== '' && projectPath !== undefined) {
                dispatch({
                    type: "SET_PROJECT_PATH", payload: {
                        projectPath: projectPath,
                        rootFolder: projectPath,
                    }
                });
            }
        });
    }
}

/* ----------------- select project patch from users dialog ----------------- */
const selectProjectFolderPath = () => {
    return function (dispatch: any) {
        ipcRenderer.send('explorer:selectProjectFolderPath');
        ipcRenderer.send('explorer:updateList');
        ipcRenderer.on('explorer:updateList@response', (event: any, listOfFilesAndFolders: any) => {
            dispatch({
                type: "UPDATE_LIST", payload: {
                    list: listOfFilesAndFolders
                }
            });
        });
    }
}

/* ------------------------- update list of explorer ------------------------ */
const stackFolders = (folderName: any) => {
    return function (dispatch: any) {
        dispatch({
            type: "STACK_FOLDER", payload: {
                folderStack: folderName
            }
        });
    }
}

const updateList = (data: any) => {
    return function (dispatch: any) {
        ipcRenderer.send('explorer:updateList', data);
        ipcRenderer.on('explorer:updateList@response', (event: any, listOfFilesAndFolders: any, err: any) => {
            if (!err) {
                dispatch({
                    type: "UPDATE_LIST", payload: {
                        list: listOfFilesAndFolders
                    }
                });
            }
        });
    }
}

/* ---------------------------- change directory ---------------------------- */

const changeFolder = (data: any) => {
    return function (dispatch: any) {
        ipcRenderer.send('explorer:changeFolderAndUpdateList', data);
        dispatch(setRootFolder(data.folderName, data.fullPath));
        dispatch(stackFolders(data.folderName));
    }
}


export { getProjectFolderPath, selectProjectFolderPath, updateList, changeFolder};