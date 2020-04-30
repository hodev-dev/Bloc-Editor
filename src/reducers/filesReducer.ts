/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
interface initialFiles {
    project_path: string,
    root_path: string,
    list: Array<string>,
    folder_stack: Array<string>
}
/* -------------------------- SECTION initial state ------------------------- */
const initialFiles: initialFiles = {
    project_path: "",
    root_path: "",
    list: [],
    folder_stack: []
}
/* -------------------------- SECTION reducer body -------------------------- */
function filesReducer(state = initialFiles, action: IAction) {
    switch (action.type) {
        case "SET_PROJECT_PATH":
            return {
                ...state, project_path: action.payload.project_path, root_path: action.payload.project_path
            }
        case "SET_LIST":
            return {
                ...state, list: action.payload.list
            }
        case "ADD_TO_FOLDER_STACK":
            return {
                ...state, folder_stack: [...state.folder_stack, action.payload.folder_stack]
            }
        default:
            return state;
    }
};
export default filesReducer;