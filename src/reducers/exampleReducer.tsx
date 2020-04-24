/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
    type: string
}
interface initialCount {
    count: number,
}
/* -------------------------- SECTION initial state ------------------------- */
const initialCount: initialCount = {
    count: 0,
}
/* -------------------------- SECTION reducer body -------------------------- */
function counterReducer(state = initialCount, action: IAction) {
    switch (action.type) {
        case "INC":
            return {
                ...state, count: state.count + 1
            }
        case "DEC":
            return {
                ...state, count: state.count - 1
            }
        default:
            return state;
    }
};
export default counterReducer;