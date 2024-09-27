import React, { useState } from "react";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    const newMessage = { role: "user", content: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: input })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();
      const botMessage = { role: "assistant", content: data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1>Restaurante Sabores Chat</h1>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user-message" : "assistant-message"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && <div className="loading">Carregando...</div>}
      </div>
      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage()}
          placeholder="Digite sua pergunta..."
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Enviar
        </button>
      </div>
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .messages-container {
          flex-grow: 1;
          overflow-y: auto;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 20px;
        }

        .message {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
          max-width: 80%;
        }

        .user-message {
          background-color: #e6f2ff;
          margin-left: auto;
          text-align: right;
        }

        .assistant-message {
          background-color: #f0f0f0;
        }

        .loading {
          text-align: center;
          color: #888;
        }

        .error-message {
          background-color: #ffebee;
          border: 1px solid #ffcdd2;
          color: #b71c1c;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .input-container {
          display: flex;
        }

        input {
          flex-grow: 1;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px 0 0 5px;
        }

        button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 0 5px 5px 0;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChatUI;
