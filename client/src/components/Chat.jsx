import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import PropTypes from "prop-types"; // Import PropTypes
import "../static/css/components/Chat.css";

const Chat = ({
  senderId,
  senderRole,
  receiverId,
  receiverRole,
  receiverUsername,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [token] = useState(localStorage.getItem("token")); // You don't need setToken as token is static
  const [trigger, setTrigger] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.emit("join", { senderId, senderRole });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.off("receiveMessage");
      newSocket.disconnect();
    };
  }, [senderId, senderRole]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat/${senderId}/${senderRole}/${receiverId}/${receiverRole}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [senderId, senderRole, receiverId, receiverRole, token, trigger]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const newMessage = {
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        content: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTrigger(!trigger);
      setMessage("");
    }
  };

  if (!token) {
    return (
      <div>
        <h1>
          Unauthorized, Please Sign in <a href="/signin">Here</a>
        </h1>
      </div>
    );
  }

  return (
    <div className="chat_section_main">
      <div className="chat_section_main_msg_area">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              className={
                msg.senderId === senderId ? "sent_message" : "received_message"
              }
              key={index}
            >
              <span>{msg.content}</span>
            </div>
          ))
        ) : (
          <span>No Messages Yet With {receiverUsername}</span>
        )}
      </div>
      <div className="chat_section_main_msg_box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

// Add PropTypes to validate props
Chat.propTypes = {
  senderId: PropTypes.string.isRequired,
  senderRole: PropTypes.string.isRequired,
  receiverId: PropTypes.string.isRequired,
  receiverRole: PropTypes.string.isRequired,
  receiverUsername: PropTypes.string.isRequired,
};

export default Chat;
