import React from "react";
import { FaUser } from "react-icons/fa";

const ChatUser = ({ message }) => {
  return (
    <div className="bg-zinc-800 text-white rounded-lg p-3 pr-10 w-full outline-none mt-4">
      <div className="flex ">
        <FaUser className="mr-4" />
        <span className="">{message}</span>
      </div>
    </div>
  );
};

export default ChatUser;
