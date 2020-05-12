import { stat } from "fs";

/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
  type: string
  payload: any
}
interface initialBloc {
  loading: boolean,
  bloc_state: Array<any>,
  bloc_name: string,
  bloc_path: string,
  is_changed: boolean
}
/* -------------------------- SECTION initial state ------------------------- */
const initialBloc: initialBloc = {
  loading: true,
  bloc_state: [],
  bloc_name: '',
  bloc_path: '',
  is_changed: false,
}
/* -------------------------- SECTION reducer body -------------------------- */
function counterReducer(state = initialBloc, action: IAction) {
  switch (action.type) {
    case "SET_BLOC":
      return {
        ...state, bloc_state: action.payload.bloc_state, bloc_name: action.payload.bloc_name, bloc_path: action.payload.bloc_path
      }
    case "TOGGLE_IS_CHANGED":
      return {
        ...state, is_changed: action.payload.is_changed
      }
    default:
      return state;
  }
};
export default counterReducer;