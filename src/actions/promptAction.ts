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

/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
    ipcRenderer.removeListener('prompt:toggleDisplay', listenToggleDisplay);
}

export { listen, dispatchToggleDisplay, unsubscribe }
