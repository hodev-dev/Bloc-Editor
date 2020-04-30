import { store } from '../App';
const ipcRenderer = window.require('electron').ipcRenderer;

/* ------------------------- listen too all electron evenets ------------------------- */
const listen = () => {
    project_path();
    get_list();
    set_list();
}
/* ------------------------------ redux actions ----------------------------- */

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
    ipcRenderer.send('files:get_List', project_path);
}

const set_list = () => {
    ipcRenderer.on('files:get_list@response', (event: any, list: Array<string>) => {
        store.dispatch(dispatch_set_list(list));
    });
}

/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
    ipcRenderer.removeListener('files:project_path', project_path);
    ipcRenderer.removeListener('files:get_list', get_list);
}

export { listen, select_project_path, unsubscribe }
