import React from "react";
import { FaUser } from "react-icons/fa";

const ChatBot = ({ message }) => {
  return (
    <div className="bg-zinc-900 text-white rounded-lg p-3 pr-10 w-full outline-none mt-4">
      <div className="flex ">
        <FaUser className="mr-4" />
        {message ? <p>{message}</p> : <p>No response available.</p>}
      </div>
    </div>
  );
};

export default ChatBot;
