/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
  type: string,
  payload: any
}
interface initialCount {
  display: boolean,
}
/* -------------------------- SECTION initial state ------------------------- */
const initialCount: initialCount = {
  display: false,
}
/* -------------------------- SECTION reducer body -------------------------- */
function searchableListReducer(state = initialCount, action: IAction) {
  switch (action.type) {
    case "TOGGLE_DISPLAY_SEARCHABLE":
      return {
        ...state, display: action.payload.display
      }
    default:
      return state;
  }
};
export default searchableListReducer;