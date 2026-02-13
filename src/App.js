// Revised App.js (Frontend React component)
// This handles the UI and sends user input to the backend server.js via POST /ask
// Removed direct Lex calls for security; now proxies through server
// Assumes you have a backend running on http://localhost:3000 (or wherever server.js is)
// You'll need to install axios or use fetch; here I'm using fetch for simplicity (no extra deps)

import React, { useState } from 'react';
// import './App.css'; // Optional: Add if you have styles

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);

    try {
      // Send to backend /ask endpoint
      const response = await fetch('http://localhost:3000/ask', {  // Change port if needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) throw new Error('Backend error');

      const { reply } = await response.json();

      // Add bot response to chat
      setMessages([...newMessages, { text: reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { text: 'Sorry, there was an error. Please try again.', sender: 'bot' }]);
    }

    setInput('');
  };

  return (
    <div className="App">
      <h1>Accounting Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            <strong>{msg.sender === 'user' ? 'You:' : 'Bot:'}</strong> {msg.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask an accounting question..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;