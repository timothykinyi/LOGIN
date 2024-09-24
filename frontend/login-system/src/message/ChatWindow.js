import React from 'react';

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.isMine ? 'my-message' : 'their-message'}`}>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
