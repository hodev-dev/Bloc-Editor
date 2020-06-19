/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
export interface IinitialFiles {
    loading: boolean,
    project_path: string,
    root_path: string,
    list: Array<string>,
    folder_stack: Array<string>
    last_file_imported: string | null
}
/* -------------------------- SECTION initial state ------------------------- */
const initialFiles: IinitialFiles = {
    loading: true,
    project_path: "",
    root_path: "",
    list: [],
    folder_stack: [],
    last_file_imported: null,
}
/* -------------------------- SECTION reducer body -------------------------- */
function filesReducer(state = initialFiles, action: IAction) {
    switch (action.type) {
        case "SET_PROJECT_PATH":
            return {
                ...state, loading: false, project_path: action.payload.project_path, root_path: action.payload.project_path
            }
        case "SET_LIST":
            return {
                ...state, list: action.payload.list
            }
        case "ADD_TO_FOLDER_STACK":
            return {
                ...state, folder_stack: [...state.folder_stack, action.payload.foldername]
            }
        case "POP_FOLDER_STACK":
            return {
                ...state, folder_stack: [...action.payload.folder_stack]
            }
        case "SET_LAST_FILE_IMPORTED":
            return {
                ...state, last_file_imported: action.payload.last_file_imported
            }
        default:
            return state;
    }
};
export default filesReducer;