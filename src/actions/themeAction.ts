import path from 'path';
import { store } from '../App';
const ipcRenderer = window.require('electron').ipcRenderer;
/* ------------------------- listen too all electron evenets ------------------------- */
const listen = () => {
    //
}
/* ------------------------------ redux actions ----------------------------- */
const set_theme = (theme: string) => (dispatch: any) => {
    dispatch({
        type: theme,
    });
}

/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
    //
}

export { listen, set_theme, unsubscribe }
