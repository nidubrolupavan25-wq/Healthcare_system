import React, { useState } from "react";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  function sendMessage(msg) {
    setMessages([...messages, { from: "user", text: msg }]);
  }

  return (
    <>
      <button id="chat-button" onClick={() => setOpen(!open)}>💬</button>

      {open && (
        <div id="chat-window">
          <div id="chat-header">JhaiHealthcare Chatbot</div>

          <div id="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.from}-message`}>
                {m.text}
              </div>
            ))}
          </div>

          <div id="chat-input-area">
            <input
              id="chat-input"
              placeholder="Type message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
