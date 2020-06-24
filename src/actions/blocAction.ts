import path from 'path';
import { store } from '../App';
const ipcRenderer = window.require('electron').ipcRenderer;

const fetch_link_data = (_url: string, id: string) => (dispatch: any) => {


}

/* -------------------------- unsbscribe to events -------------------------- */
// memory leak bug fix
const unsubscribe = () => {
    //
}

export {
    fetch_link_data,
    unsubscribe,
}
