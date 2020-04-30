import { store } from '../App';
import { pathToFileURL } from 'url';
import path from 'path';

const ipcRenderer = window.require('electron').ipcRenderer;

/* ------------------------- listen too all electron evenets ------------------------- */
const listen = () => {
    project_path();
}
/* -------------------------- redux action dispatcher -------------------------- */
const dispatch_set_project_path = (_project_path: string) => {
    return {
        type: 'SET_PROJECT_PATH',
        payload: {
            project_path: _project_path
        }
    }
}

const dispatch_set_list = (_list: Array<string>) => {
    return {
        type: "SET_LIST",
        payload: {
            list: _list
        }
    }
}

const dispatch_add_to_folder_stack = (foldername: string) => {
    return {
        type: "ADD_TO_FOLDER_STACK",
        payload: {
            folder_stack: foldername
        }
    }
}
/* ------------------------------ electron events  ------------------------------ */
const project_path = () => {
    ipcRenderer.on('files:project_path', (event: any, project_path: string) => {
        store.dispatch(dispatch_set_project_path(project_path));
    });
}
const select_project_path = () => {
    ipcRenderer.send('files:select_project_path');
}


const get_list = () => {
    const { project_path } = store.getState().filesReducer;
    const { root_path } = store.getState().filesReducer;
    const { folder_stack } = store.getState().filesReducer;
    console.log('get list')
    ipcRenderer.send('files:get_List', project_path, root_path, folder_stack);
}

const set_list = () => {
    ipcRenderer.on('files:get_list@response', (event: any, list: Array<string>) => {
        console.log('set list')
        store.dispatch(dispatch_set_list(list));
    });
}

const got_to_folder = (dir: { title: string, type: string, full_path: string }) => {
    store.dispatch(dispatch_add_to_folder_stack(dir.title));
}

/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
    ipcRenderer.removeListener('files:project_path', project_path);
    ipcRenderer.removeListener('files:get_list', get_list);
    ipcRenderer.removeListener('files:get_list@response', set_list);
}

export { listen, select_project_path, get_list, set_list, got_to_folder, unsubscribe }
