/* ---------------------- SECTION typescript interface ---------------------- */
interface IAction {
  type: string,
  payload: any
}
interface initialNotification {
  notification_list: Array<any>,
}
/* -------------------------- SECTION initial state ------------------------- */
const initialNotification: initialNotification = {
  notification_list: [],
}
/* -------------------------- SECTION reducer body -------------------------- */
function notificationReducer(state = initialNotification, action: IAction) {
  switch (action.type) {
    case "PUSH_TO_NOTIFICATION_LIST":
      return {
        ...state, notification_list: [...state.notification_list, ...action.payload.notification_list]
      }
    case "SHIFT_FROM_NOTIFICATION_LIST":
      return {
        ...state, notification_list: action.payload.notification_list
      }
    default:
      return state;
  }
};
export default notificationReducer;