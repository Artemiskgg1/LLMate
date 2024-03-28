import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Chat from "./components/chat/Chat";

function App() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <Chat />
      </div>
    </>
  );
}

export default App;
