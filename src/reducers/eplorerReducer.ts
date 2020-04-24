/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
interface initialCount {
    visible: boolean,
    rootFolder: string,
    projectPath: string,
    folderName: string,
    folderStack: Array<string>,
    initialExplorer: any
}
/* -------------------------- SECTION initial state ------------------------- */
const initialExplorer: initialCount = {
    visible: false,
    rootFolder: '',
    projectPath: '',
    folderName: '',
    folderStack: [],
    initialExplorer: [],
}
/* -------------------------- SECTION reducer body -------------------------- */
function explorerReducer(state = initialExplorer, action: IAction) {
    switch (action.type) {
        case "toggle":
            return {
                ...state, visible: !state.visible
            }
        case "SET_PROJECT_PATH":
            return {
                ...state, rootFolder: action.payload.rootFolder,projectPath: action.payload.projectPath,
            }
        case "UPDATE_ROOT_FOLDER":
            return {
                ...state, rootFolder: action.payload.rootFolder,folderName: action.payload.folderName
            }
        case "UPDATE_LIST":
            return {
                ...state, initialExplorer: action.payload.list,
            }
        case "STACK_FOLDER":
            return {
                ...state,folderStack: [...state.folderStack,action.payload.folderStack]
            }
        default:
            return state;
    }
};
export default explorerReducer;