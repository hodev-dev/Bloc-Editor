/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
  type: string
  palyload: any
}
interface initialBloc {
  loading: boolean,
  bloc_state: Array<any>
}
/* -------------------------- SECTION initial state ------------------------- */
const initialBloc: initialBloc = {
  loading: true,
  bloc_state: []
}
/* -------------------------- SECTION reducer body -------------------------- */
function counterReducer(state = initialBloc, action: IAction) {
  switch (action.type) {
    case "INC":
      return {
        ...state
      }
    default:
      return state;
  }
};
export default counterReducer;