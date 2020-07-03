import * as light from '../ui/themes/default_light.json';
import * as dark from '../ui/themes/default_dark.json';
/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string,
    payload: any
}
export interface Itheme {
    theme: any
}
/* -------------------------- SECTION initial state ------------------------- */
const initialPrompt: Itheme = {
    theme: dark
}
/* -------------------------- SECTION reducer body -------------------------- */
function themeReducer(state = initialPrompt, action: IAction) {
    switch (action.type) {
        case "SET_LIGHT":
            return {
                ...state, theme: { ...light }
            }
        case "SET_DARK":
            return {
                ...state, theme: { ...dark }
            }
        default:
            return state;
    }
};
export default themeReducer;