import { store } from '../App';
const ipcRenderer = window.require('electron').ipcRenderer;

/* ------------------------- listen too all electron evenets ------------------------- */
const listen = () => {
    project_path();
}
/* ------------------------------ redux actions ----------------------------- */

/* -------------------------- redux action dispatcher -------------------------- */

/* ------------------------------ electron events  ------------------------------ */
const project_path = () => {
    ipcRenderer.on('files:project_path', (event: any,project_path: string) => {
        console.log(project_path);
    });
}
/* -------------------------- unsbscribe to events -------------------------- */
const unsubscribe = () => {
    ipcRenderer.removeListener('files:project_path', project_path);
}

export { listen, unsubscribe }
