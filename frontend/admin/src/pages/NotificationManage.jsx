import React from "react";

import NotificationList from "../components/NotificationManage/NotificationList";
import NotificationPost from "../components/NotificationManage/NotificationPost";

const NotificationManage = () => {
  return (
    <div>
      <NotificationPost />
      <NotificationList />
    </div>
  );
};

export default NotificationManage;
