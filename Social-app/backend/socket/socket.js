import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000", // Đảm bảo cài đặt đúng origin của client
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  // Lấy userId từ query params của socket
  const userId = socket.handshake.query.userId;

  // Nếu userId hợp lệ, thêm vào userSocketMap
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }
  
  // Phát danh sách người dùng trực tuyến cho tất cả các client mỗi khi có kết nối
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Xử lý đọc tin nhắn và cuộc hội thoại 
  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
		try {
			await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
			await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
			io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
		} catch (error) {
			console.log(error);
		}
	});

  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Xóa user khỏi userSocketMap khi ngắt kết nối
    if (userId !== "undefined") {
      delete userSocketMap[userId];
    }

    // Phát lại danh sách người dùng trực tuyến cho tất cả các client sau khi có sự thay đổi
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
