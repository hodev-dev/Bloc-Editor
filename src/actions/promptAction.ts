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

const set_display = (_display_state: boolean) => {
    return {
        type: "TOGGLE_DISPLAY",
        payload: {
            display: _display_state
        }
    }
}

const set_select = (_select: string) => (dispatch: any) => {
    dispatch(
        {
            type: "SET_SELECT",
            payload: {
                select_action: _select
            }
        }
    )
}

/* -------------------------- redux action dispatcher -------------------------- */
const dispatchToggleDisplay = () => {
    const { display } = store.getState().promptReducer;
    store.dispatch(toggleDisplay(display));
}

const display = (_display_state: boolean) => {
    store.dispatch(set_display(_display_state));
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

export { listen, dispatchToggleDisplay, set_select, display, create_folder, unsubscribe }
