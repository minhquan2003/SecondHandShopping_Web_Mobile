import React from "react";

import NotificationList from "../components/NotificationManage/NotificationList";
import NotificationPost from "../components/NotificationManage/NotificationPost";

const NotificationManage = () => {
  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
      <NotificationPost />
      <NotificationList />
    </div>
  );
};

export default NotificationManage;
