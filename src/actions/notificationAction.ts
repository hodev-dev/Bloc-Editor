import path from 'path';
const ipcRenderer = window.require('electron').ipcRenderer;

const listen = () => (dispatch: any, getState: any) => {
  ipcRenderer.on('notification:push', (event: any, notification_body: any) => {
    dispatch({
      type: "PUSH_TO_NOTIFICATION_LIST",
      payload: {
        notification_list: notification_body
      }
    })
  });
}

const shift_notification = () => (dispatch: any, getState: any) => {
  const { notification_list } = getState().notificationReducer;
  notification_list.shift();
  dispatch({
    type: "SHIFT_FROM_NOTIFICATION_LIST",
    payload: {
      notification_list: notification_list
    }
  });
};

const unsubscribe = () => {
  ipcRenderer.removeAllListeners('notification:push');
}

export {
  listen,
  shift_notification,
  unsubscribe,
}