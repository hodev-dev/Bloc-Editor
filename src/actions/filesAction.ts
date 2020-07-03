import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as cmp from '../blocs';
import { store } from '../App';
const ipcRenderer = window.require('electron').ipcRenderer;

const request_path = () => (dispatch: any) => {
    ipcRenderer.send('files:get_path');
}

const get_path = () => (dispatch: any) => {
    ipcRenderer.on('files:get_path', (event: any, _project_path: string, theme_name: string) => {
        dispatch({
            type: "SET_PROJECT_PATH",
            payload: {
                project_path: _project_path
            }
        });
        dispatch({
            type: theme_name
        });
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

const read_file = (item: any) => (dispatch: any, getState: any) => {
    const { project_path } = getState().filesReducer;
    const { folder_stack } = getState().filesReducer;
    const _path = path.join(project_path, ...folder_stack, item.title);
    ipcRenderer.send('files:read_file', _path);
    ipcRenderer.on('files:read_file', (event: any, data: any) => {
        const parse_file = JSON.parse(data);
        dispatch({
            type: 'SET_BLOC',
            payload: {
                bloc_name: item.title,
                bloc_state: parse_file,
                bloc_path: _path,
            }
        })
    });
}

const create_file = (answer: Array<string>) => (dispatch: any, getState: any) => {
    const init_component = [
        {
            id: uuidv4(),
            component: cmp.Bloc_Components.Text.name,
            state: 'text-1'
        }, {
            id: uuidv4(),
            component: cmp.Bloc_Components.Text.name,
            state: 'text-2'
        }
    ];
    const { project_path } = getState().filesReducer;
    const { folder_stack } = getState().filesReducer;
    const file_name = answer[0];
    const _path = path.join(project_path, ...folder_stack, file_name + '.bloc');
    ipcRenderer.send('files:create_bloc', _path, init_component);
}

const save_file = (bloc_path: string, componentList: any) => (dispatch: any) => {
    const cmplist = componentList.map((obj: any) => {
        if (obj.component) {
            obj.component = cmp.Bloc_Components[obj.component.name]['name'];
        }
        return obj;
    });
    ipcRenderer.send('files:save_bloc', bloc_path, cmplist);
}

const togge_is_changed = (_is_changed: boolean) => (dispatch: any) => {
    dispatch({
        type: 'TOGGLE_IS_CHANGED',
        payload: {
            is_changed: _is_changed
        }
    });
}

const add_to_past: any = (_bloc_state: any) => (dispatch: any, getState: any): Promise<any> => {
    return new Promise((resolve) => {
        console.log({ _bloc_state })
        dispatch({
            type: "ADD_TO_PAST",
            payload: {
                past_bloc_state: _bloc_state
            }
        });
        resolve();
    });
}



const undo = (_future_bloc_state: any, _bloc_state: any, _past_bloc_state: any) => (dispatch: any, getState: any) => {
    if (_past_bloc_state.length > 0) {
        let current = _past_bloc_state[_past_bloc_state.length - 1];
        let new_past = _past_bloc_state.slice(0, _past_bloc_state.length - 1);
        dispatch({
            type: "UNDO",
            payload: {
                past_bloc_state: new_past,
                bloc_state: [...current],
                future_bloc_state: [_bloc_state, ..._future_bloc_state]
            }
        })
    }
}

const redo = (_future_bloc_state: any, _bloc_state: any, _past_bloc_state: any) => (dispatch: any, getState: any) => {
    if (_future_bloc_state.length > 0) {
        const current = _future_bloc_state[0];
        const new_future = _future_bloc_state.slice(1);
        dispatch({
            type: "REDO",
            payload: {
                past_bloc_state: [..._past_bloc_state, _bloc_state],
                bloc_state: current,
                future_bloc_state: new_future
            }
        })
    }
}


const import_media = (_project_path: any) => (dispatch: any) => {
    ipcRenderer.send('files:import_media', _project_path);
    ipcRenderer.on('files:import_media_path', (event: any, last_file_imported_path: string) => {
        dispatch({
            type: "SET_LAST_FILE_IMPORTED",
            payload: {
                last_file_imported: last_file_imported_path
            }
        })
    });
}

/* -------------------------- unsbscribe to events -------------------------- */
// memory leak bug fix
const unsubscribe = () => {
    ipcRenderer.removeListener('files:get_path', get_path);
    ipcRenderer.removeListener('files:select_path', select_path);
    ipcRenderer.removeListener('files:request_list', request_list);
    ipcRenderer.removeListener('files:request_list', add_to_folder_stack);
    ipcRenderer.removeListener('files:request_list', go_to_folder_stack);
    ipcRenderer.removeListener('files:request_list', pop_folder_stack);
    ipcRenderer.removeListener('files:get_list', get_list);
    ipcRenderer.removeListener('files:read_file', read_file);
    ipcRenderer.removeAllListeners('files:create_bloc');
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
    read_file,
    create_file,
    save_file,
    togge_is_changed,
    add_to_past,
    undo,
    redo,
    import_media,
    unsubscribe,
}
