import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import ChatWindow from './message/ChatWindow';
import MessageInput from './message/MessageInput';
import MessageList from './message/MessageList';
// Connect to the backend server for real-time messaging
const socket = io('http://localhost:5000');

function App2() {
  // Sample data: List of people you can text
  const [chats, setChats] = useState([
    { id: 1, name: 'John Doe', lastMessage: 'Hey, what’s up?' },
    { id: 2, name: 'Jane Smith', lastMessage: 'Where are you?' },
    { id: 3, name: 'Study Group', lastMessage: 'Meeting at 3 PM' },
  ]);

  // Chat state for current selected person and messages
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Effect to listen for new messages via socket.io
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  // Function to send a message via socket.io
  const sendMessage = (messageText) => {
    const message = {
      text: messageText,
      isMine: true,
      sender: 'Me',
      recipient: selectedChat.name,
    };
    // Emit the message to the server
    socket.emit('message', message);
    setMessages([...messages, message]);
  };

  return (
    <div className="app">
      {/* List of available chats */}
      <MessageList chats={chats} selectChat={setSelectedChat} />

      {/* Render chat window only when a person is selected */}
      {selectedChat && (
        <div className="chat-container">
          <h2>Chat with {selectedChat.name}</h2>
          <ChatWindow messages={messages.filter(msg => msg.recipient === selectedChat.name || msg.sender === selectedChat.name)} />
          <MessageInput sendMessage={sendMessage} />
        </div>
      )}
    </div>
  );
}
export default App2;
