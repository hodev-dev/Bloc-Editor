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
    type: "TOGGLE_DISPLAY_SEARCHABLE",
    payload: {
      display: !display
    }
  }
}
/* -------------------------- redux action dispatcher -------------------------- */
const dispatchToggleDisplay = () => {
  const { display } = store.getState().searchableListReducer;
  store.dispatch(toggleDisplay(display));
}
/* ------------------------------ electron events  ------------------------------ */
const listenToggleDisplay = () => {
  ipcRenderer.on('searchableList:toggleDisplay', (event: any, initState: boolean) => {
    dispatchToggleDisplay()
  });
}
/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
  ipcRenderer.removeListener('searchableList:toggleDisplay', listenToggleDisplay);
}

export { listen, dispatchToggleDisplay, unsubscribe }
