import path from 'path';

const ipcRenderer = window.require('electron').ipcRenderer;

const request_path = () => (dispatch: any) => {
    ipcRenderer.send('files:get_path');
}
const get_path = () => (dispatch: any) => {
    ipcRenderer.on('files:get_path', (event: any, _project_path: string) => {
        dispatch({
            type: "SET_PROJECT_PATH",
            payload: {
                project_path: _project_path
            }
        })
    });
}

const select_path = () => (dispatch: any, getState: any) => {
    const { project_path } = getState().filesReducer;
    ipcRenderer.send('files:select_path');
}

const request_list = () => (dispatch: any, getState: any) => {
    const { project_path } = getState().filesReducer;
    ipcRenderer.send('files:request_list', project_path);
}

const get_list = () => (dispatch: any) => {
    ipcRenderer.on('files:request_list', (event: any, _list: any) => {
        dispatch({
            type: "SET_LIST",
            payload: {
                list: _list
            }
        });
    });
}

const add_to_folder_stack = (foldername: any) => (dispatch: any, getState: any) => {
    dispatch({
        type: "ADD_TO_FOLDER_STACK",
        payload: {
            foldername: foldername
        }
    });
}

const pop_folder_stack = () => (dispatch: any, getState: any) => {
    const { folder_stack } = getState().filesReducer;
    folder_stack.pop();
    dispatch({
        type: "POP_FOLDER_STACK",
        payload: {
            folder_stack: folder_stack
        }
    });
}

const go_to_folder_stack = () => (dispatch: any, getState: any) => {
    const { project_path } = getState().filesReducer;
    const { folder_stack } = getState().filesReducer;
    const _path = path.join(project_path, ...folder_stack);
    ipcRenderer.send('files:request_list', _path);
}


/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
    ipcRenderer.removeListener('files:get_path', get_path);
    ipcRenderer.removeListener('files:select_path', select_path);
    ipcRenderer.removeListener('files:request_list', request_list);
    ipcRenderer.removeListener('files:request_list', add_to_folder_stack);
    ipcRenderer.removeListener('files:request_list', go_to_folder_stack);
    ipcRenderer.removeListener('files:request_list', pop_folder_stack);
    ipcRenderer.removeListener('files:get_list', get_list);
}

export {
    request_path,
    request_list,
    get_path,
    get_list,
    select_path,
    add_to_folder_stack,
    pop_folder_stack,
    go_to_folder_stack,
    unsubscribe,
}
