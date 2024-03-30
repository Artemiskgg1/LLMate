import React, { useState, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import ChatUser from "./ChatUser";
import ChatBot from "./ChatBot";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [sentMessages, setSentMessages] = useState([]);
  const [botResponses, setBotResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initWebSocket = () => {
      const ws = new WebSocket("ws://localhost:8000/chat");
      setWebsocket(ws);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setBotResponses([...botResponses, data.answer]);
        setIsLoading(false);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    };

    initWebSocket();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [botResponses]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    if (websocket && message.trim() !== "") {
      websocket.send(message);
      setSentMessages([...sentMessages, message]);
      setMessage("");
      setIsLoading(true);
    }
  };

  return (
    <div className="bg-zinc-950 w-screen h-screen text-white flex flex-col">
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
          <IoSendSharp
            onClick={sendMessage}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          />
        </div>
        {sentMessages.map((msg, index) => (
          <ChatUser key={index} message={msg} />
        ))}
        {isLoading ? (
          <div className="text-center mt-4">Loading...</div>
        ) : (
          botResponses.map((response, index) => (
            <ChatBot key={index} message={response} />
          ))
        )}
      </div>
    </div>
  );
};

export default Chat;
