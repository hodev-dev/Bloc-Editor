/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
  type: string,
  payload: any
}
export interface IinitialSearchableList {
  display: boolean,
}
/* -------------------------- SECTION initial state ------------------------- */
const initialCount: IinitialSearchableList = {
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