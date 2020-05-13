import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as notificationAction from '../../actions/notificationAction';

const Notification = () => {
  const dispatch = useDispatch();
  const { notification_list } = useSelector((store: any) => store.notificationReducer);

  useEffect(() => {
    dispatch(notificationAction.listen());
    return () => {
      notificationAction.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const notification_timeout = notification_list.forEach((item: any, index: number) => {
      setTimeout(() => {
        dispatch(notificationAction.shift_notification())
      }, 5000 + (index * 5000));
    });
    return () => {
      clearTimeout(notification_timeout);
    }
  }, [notification_list])

  const notification_color = (type: string) => {
    switch (type) {
      case "Error":
        return "bg-red-200"
      case "Success":
        return "bg-green-200"
      case "Info":
        return "bg-blue-200"
      default:
        return "bg-black "
    }
  }

  const renderNofitications = (): Array<JSX.Element> => {
    return notification_list.map((notification: any, index: number) => {
      const color = notification_color(notification.type);
      return (
        <div key={index} className={`w-full h-auto overflow-auto p-3 ${color} rounded-md opacity-50 border hover:opacity-100`}>
          <h1><b>{notification.type}</b></h1>
          <h5>{notification.messege}</h5>
        </div>
      )
    });
  }

  return (
    <div className="absolute w-1/6 h-auto overflow-auto top-0 right-0 mr-10 mt-20">
      {renderNofitications()}
    </div>
  );
}

export default Notification;
