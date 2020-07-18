import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as cmp from '../blocs';
import { store } from '../App';
const ipcRenderer = window.require('electron').ipcRenderer;

const set_loading = (_loading_state: boolean) => (dispatch: any) => {
    dispatch({
        type: "SET_LOADING",
        payload: _loading_state
    });
}
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
const set_items_per_page = (_items_pager_page: number) => (dispatch: any) => {
    dispatch({
        type: "SET_ITEMS_PER_PAGE",
        payload: {
            items_per_page: _items_pager_page
        }
    });
}

const set_render_index = (_render_index: number) => (dispatch: any) => {
    dispatch({
        type: "SET_RENDER_INDEX",
        payload: {
            render_index: _render_index
        }
    });
}

const set_bloc_size = (_new_bloc_size: number) => (dispatch: any) => {
    dispatch({
        type: "SET_BLOC_SIZE",
        payload: {
            bloc_size: _new_bloc_size
        }
    })
}

const read_file = (item: any) => (dispatch: any, getState: any) => {
    const { project_path } = getState().filesReducer;
    const { folder_stack } = getState().filesReducer;
    const { render_index } = getState().filesReducer;
    const { items_per_page } = getState().filesReducer;

    const _path = path.join(project_path, ...folder_stack, item.title);
    ipcRenderer.send('files:read_file', _path, render_index, items_per_page);
    ipcRenderer.on('files:read_file', (event: any, data: any, _bloc_size: number) => {
        dispatch({
            type: 'SET_BLOC',
            payload: {
                bloc_name: item.title,
                bloc_state: data,
                bloc_path: _path,
                bloc_size: _bloc_size
            }
        });
    });
}

const create_file = (answer: Array<string>) => (dispatch: any, getState: any) => {
    const init_component = [
        {
            id: uuidv4(),
            type: cmp.Bloc_Components.HeaderText.name,
            component: cmp.Bloc_Components.HeaderText.name,
            state: ''
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
            obj.component = cmp.Bloc_Components[obj.type].name;
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

const toggleDisplay = () => (dispatch: any, getState: any) => {
    const { visible } = getState().filesReducer;
    dispatch({
        type: "SET_VISIBLE",
        payload: {
            visible: !visible
        }
    });
}

const listenToggleDisplay = () => (dispatch: any) => {
    ipcRenderer.on('files:toggleDisplay', (event: any, initState: boolean) => {
        dispatch(toggleDisplay());
    });
}

const close = () => (dispatch: any, getState: any) => {
    dispatch({
        type: "CLOSE_BLOC",
    });
}

const test_change_path = (_project_path: any) => (dispatch: any) => {
    ipcRenderer.send('test:change_id', _project_path);
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
    toggleDisplay,
    listenToggleDisplay,
    set_loading,
    request_path,
    request_list,
    get_path,
    get_list,
    select_path,
    add_to_folder_stack,
    pop_folder_stack,
    go_to_folder_stack,
    set_items_per_page,
    set_render_index,
    set_bloc_size,
    read_file,
    create_file,
    save_file,
    togge_is_changed,
    add_to_past,
    undo,
    redo,
    close,
    test_change_path,
    unsubscribe,
}
