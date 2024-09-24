import React from 'react';

const MessageList = ({ chats, selectChat }) => {
  return (
    <div className="message-list">
      <h3>Chats</h3>
      {chats.map((chat) => (
        <div key={chat.id} onClick={() => selectChat(chat)} className="chat-item">
          <h4>{chat.name}</h4>
          <p>{chat.lastMessage}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
