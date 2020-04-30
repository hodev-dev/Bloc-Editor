/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
interface initialFiles {
    project_path: string,
    list: Array<string>
}
/* -------------------------- SECTION initial state ------------------------- */
const initialFiles: initialFiles = {
    project_path: "",
    list: []
}
/* -------------------------- SECTION reducer body -------------------------- */
function filesReducer(state = initialFiles, action: IAction) {
    switch (action.type) {
        case "SET_PROJECT_PATH":
            return {
                ...state, project_path: action.payload.project_path
            }
        case "SET_LIST":
            return {
                ...state, list: action.payload.list
            }
        default:
            return state;
    }
};
export default filesReducer;