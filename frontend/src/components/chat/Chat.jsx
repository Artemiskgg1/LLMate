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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3; // Maximum number of retry attempts

  useEffect(() => {
    // Function to initialize WebSocket connection
    const initWebSocket = () => {
      const ws = new WebSocket("ws://localhost:8000/chat");
      setWebsocket(ws);

      ws.onopen = () => {
        setRetryCount(0); // Reset retry count on successful connection
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setBotResponses([...botResponses, data.result]);
        setIsLoading(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reconnectWebSocket();
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        reconnectWebSocket();
      };
    };

    // Initialize WebSocket connection
    initWebSocket();

    // Cleanup function to close WebSocket connection
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [botResponses, retryCount]); // Retry when botResponses or retryCount changes

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

  const reconnectWebSocket = () => {
    // Retry connecting to WebSocket with exponential backoff
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with maximum delay of 30 seconds
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(retryCount + 1);
      }, retryDelay);
    } else {
      console.error(
        "Exceeded maximum retry attempts. Please refresh the page."
      );
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
        {/* Display sent messages */}
        {sentMessages.map((msg, index) => (
          <ChatUser key={index} message={msg} />
        ))}
        {/* Display bot responses or spinner */}
        {isLoading ? (
          <div className="text-center mt-4">Loading...</div>
        ) : (
          botResponses.map((response, index) => (
            <ChatBot key={index} message={response.result} />
          ))
        )}
      </div>
    </div>
  );
};

export default Chat;
