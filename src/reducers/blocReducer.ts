import { stat } from "fs";

/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
  type: string
  payload: any
}
export interface IinitialBloc {
  loading: boolean,
  past_bloc_state: Array<any>,
  bloc_state: Array<any>,
  future_bloc_state: Array<any>,
  bloc_name: string,
  bloc_path: string,
  is_changed: boolean
}
/* -------------------------- SECTION initial state ------------------------- */
const initialBloc: IinitialBloc = {
  loading: true,
  past_bloc_state: [],
  bloc_state: [],
  future_bloc_state: [],
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
    case "ADD_TO_PAST":
      return {
        ...state, past_bloc_state: [...state.past_bloc_state, action.payload.past_bloc_state]
      }
    case "UNDO":
      return {
        ...state, bloc_state: action.payload.bloc_state, future_bloc_state: action.payload.future_bloc_state, past_bloc_state: action.payload.past_bloc_state
      }
    case "REDO":
      return {
        ...state, bloc_state: action.payload.bloc_state, future_bloc_state: action.payload.future_bloc_state, past_bloc_state: action.payload.past_bloc_state
      }
    default:
      return state;
  }
};
export default counterReducer;