/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
interface initialCount {
    display: boolean,
}
/* -------------------------- SECTION initial state ------------------------- */
const initialPrompt: initialCount = {
    display: false,
}
/* -------------------------- SECTION reducer body -------------------------- */
function propmptReducer(state = initialPrompt, action: IAction) {
    switch (action.type) {
        case "TOGGLE_DISPLAY":
            return {
                ...state, display: action.payload.display
            }
        default:
            return state;
    }
};
export default propmptReducer;