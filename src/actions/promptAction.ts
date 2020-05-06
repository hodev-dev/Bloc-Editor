import path from 'path';
import { store } from '../App';

const ipcRenderer = window.require('electron').ipcRenderer;

/* ------------------------- listen too all electron evenets ------------------------- */
const listen = () => {
    listenToggleDisplay();
}
/* ------------------------------ redux actions ----------------------------- */
const toggleDisplay = (display: boolean) => {
    return {
        type: "TOGGLE_DISPLAY",
        payload: {
            display: !display
        }
    }
}
/* -------------------------- redux action dispatcher -------------------------- */
const dispatchToggleDisplay = () => {
    const { display } = store.getState().promptReducer;
    store.dispatch(toggleDisplay(display));
}
/* ------------------------------ electron events  ------------------------------ */
const listenToggleDisplay = () => {
    ipcRenderer.on('prompt:toggleDisplay', (event: any, initState: boolean) => {
        dispatchToggleDisplay();
    });
}

const create_folder = (action_answer: any) => (dispatch: any, getState: any) => {
    // console.log({ action_answer })
    const _path = path.join(String(action_answer[0]), String(action_answer[1]));
    ipcRenderer.send('prompt:create_folder', _path);
}
/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
    ipcRenderer.removeListener('prompt:toggleDisplay', listenToggleDisplay);
}

export { listen, dispatchToggleDisplay, create_folder, unsubscribe }
