/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
interface initialCount {
    display: boolean,
    select_action: string
}
/* -------------------------- SECTION initial state ------------------------- */
const initialPrompt: initialCount = {
    display: false,
    select_action: ''
}
/* -------------------------- SECTION reducer body -------------------------- */
function propmptReducer(state = initialPrompt, action: IAction) {
    switch (action.type) {
        case "TOGGLE_DISPLAY":
            return {
                ...state, display: action.payload.display
            }
        case "SET_SELECT":
            return {
                ...state, select_action: action.payload.select_action
            }
        default:
            return state;
    }
};
export default propmptReducer;