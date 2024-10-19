require("dotenv").config();
const { MONGODB_URI, NODE_ENV } = process.env;
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./src/models/message");
require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
const freelancerRoutes = require("./src/routes/freelancerRoute");
const producerRoutes = require("./src/routes/producerRoute");
const authRoutes = require("./src/routes/authRoute");
const connectionRoutes = require("./src/routes/connectionRoute");
const channeliRoutes = require("./src/routes/channeliRoute");

app.use("", authRoutes);
app.use("", connectionRoutes);
app.use("", channeliRoutes);
app.use("/freelancer", freelancerRoutes);
app.use("/producer", producerRoutes);
app.use("/chat", require("./src/routes/chatRoute"));

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("join", ({ senderId, senderRole }) => {
    const room = `${senderRole}-${senderId}`;
    socket.join(room);
    console.log(
      `User ${senderId} with senderRole ${senderRole} joined room ${room}`
    );
  });
  socket.on("sendMessage", async (messageData) => {
    const { senderId, senderRole, receiverId, receiverRole, content } =
      messageData;
    // Save the message to the database
    const message = new Message({
      sender: senderId,
      senderRole,
      receiver: receiverId,
      receiverRole,
      content,
      timestamp: new Date(),
    });
    await message.save();
    // Emit the message to the receiver
    const room = `${receiverRole}-${receiverId}`;
    io.to(room).emit("receiveMessage", message);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
