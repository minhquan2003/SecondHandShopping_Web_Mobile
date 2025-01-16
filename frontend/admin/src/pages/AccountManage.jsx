import React from "react";
import UserList from "../components/AccountManage/UserList.jsx";
import AccountOverview from "../components/Dashboard/AccountOverview.jsx";

const AccountManage = () => {
  return (
    <div>
      <AccountOverview />
      <UserList />
    </div>
  );
};
export default AccountManage;
