/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
export interface IinitialFiles {
    visible: boolean,
    loading: boolean,
    project_path: string,
    root_path: string,
    list: Array<string>,
    folder_stack: Array<string>
    last_file_imported: string | null,
    render_index: number,
    items_per_page: number,
}
/* -------------------------- SECTION initial state ------------------------- */
const initialFiles: IinitialFiles = {
    visible: true,
    loading: true,
    project_path: "",
    root_path: "",
    list: [],
    folder_stack: [],
    last_file_imported: null,
    render_index: 0,
    items_per_page: 10
}
/* -------------------------- SECTION reducer body -------------------------- */
function filesReducer(state = initialFiles, action: IAction) {
    switch (action.type) {
        case "SET_VISIBLE":
            return {
                ...state, visible: action.payload.visible
            }
        case "SET_PROJECT_PATH":
            return {
                ...state, loading: false, project_path: action.payload.project_path, root_path: action.payload.project_path
            }
        case "SET_LOADING":
            return {
                ...state, loading: action.payload.loading
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
        case "SET_RENDER_INDEX":
            return {
                ...state, render_index: action.payload.render_index
            }
        case "SET_ITEMS_PER_PAGE":
            return {
                ...state, items_per_page: action.payload.items_per_page
            }
        default:
            return state;
    }
};
export default filesReducer;