import React, { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import userAtom from "../atoms/userAtom.js";
import { createContext } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  useEffect(() => {
    if (user?._id) {
      // Khởi tạo socket và kết nối với server
      const newSocket = io("http://localhost:5000", {
        query: {
          userId: user._id,
        },
      });

      setSocket(newSocket);

      // Lắng nghe sự kiện "getOnlineUsers" để nhận danh sách người dùng trực tuyến
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Dọn dẹp khi component unmount
      return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    }
  }, [user?._id]);

  useEffect(() => {
    console.log("Online Users: ", onlineUsers);
  }, [onlineUsers]);

  return (
    <SocketContext.Provider value={{socket, onlineUsers}}>
      {children}
    </SocketContext.Provider>
  );
};
