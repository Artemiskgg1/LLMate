import React, { useState } from "react";
import { IoSendSharp } from "react-icons/io5";

const Chat = () => {
  const [message, setMessage] = useState("");

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className="bg-zinc-950 w-screen h-screen text-white flex">
      <div className="md:m-32 md:w-2/3 m-12 ">
        <h1 className="text-5xl font-bold mb-3">Chat with your PDF 📚</h1>
        <p>Ask a question about your documents: </p>
        <div className="relative mt-7">
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message here..."
            className="bg-zinc-800 text-white rounded-lg p-2 pr-10 w-full outline-none"
          />
          <IoSendSharp className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
