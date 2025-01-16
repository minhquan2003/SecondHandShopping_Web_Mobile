import React from "react";
import useUser from "../../hooks/useUser";
import usePartner from "../../hooks/usePartner";
import useFeedback from "../../hooks/useFeedback";
import { HiOutlineUserGroup } from "react-icons/hi2";
import {
  AiOutlineUsergroupDelete,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";

const AccountOverview = () => {
  const { accounts, bans } = useUser();
  const { partners, requestPartners } = usePartner();
  const { feedbackTotal } = useFeedback(); // Sử dụng feedbackTotal thay vì feedbacks

  return (
    <div className="ml-[16.6666%] p-4 bg-gray-100 rounded-md border-b-2 border-black-300 pb-8">
      <h2 className="text-2xl text-blue-600 font-semibold mb-4 mx-4">
        Account Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mx-4">
        <div className="flex flex-col items-center bg-blue-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <HiOutlineUserGroup />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">{accounts}</div>
            <div className="text-sm text-white">Accounts</div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-red-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <AiOutlineUsergroupDelete />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">{bans}</div>
            <div className="text-sm text-white">Bans</div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-yellow-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <AiOutlineUsergroupAdd />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {partners.length}
            </div>
            <div className="text-sm text-white">Partners</div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-violet-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <VscFeedback />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {requestPartners.length}
            </div>
            <div className="text-sm text-white">Request Partners</div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-green-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <VscFeedback />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {feedbackTotal}
            </div>
            <div className="text-sm text-white">Feedbacks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
