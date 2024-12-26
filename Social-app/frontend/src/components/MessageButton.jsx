import { Button } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom, conversationsAtom } from "../atoms/messageAtom";
import userAtom from "../atoms/userAtom";
import React from "react";
import { useNavigate } from "react-router-dom";

const MessageButton = ({ user }) => {
  const currentUser = useRecoilValue(userAtom); // Lấy thông tin currentUser từ Recoil
  const [, setSelectedConversation] = useRecoilState(selectedConversationAtom); // Dùng để lưu cuộc hội thoại đã chọn
  const [conversations, setConversations] = useRecoilState(conversationsAtom); // Dùng để lưu danh sách cuộc hội thoại
  const navigate = useNavigate(); 

  const handleMessageClick = () => {
    // Kiểm tra xem user và currentUser có giá trị hợp lệ không
    if (!user || !user._id || !currentUser || !currentUser._id) {
      console.error("User or currentUser ID is undefined");
      return; // Dừng lại nếu có vấn đề với ID
    }

    // Kiểm tra xem cuộc hội thoại đã tồn tại chưa
    const existingConversation = conversations.find(
      (conversation) =>
        conversation.participants?.some((participant) => participant._id === user._id)
    );

    if (existingConversation) {
      // Nếu cuộc hội thoại đã tồn tại, đặt nó làm cuộc hội thoại được chọn
      setSelectedConversation({
        _id: existingConversation._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
        mock: false, // Đảm bảo không phải là đoạn hội thoại giả
      });
    } else {
      // Nếu chưa có cuộc hội thoại, tạo đoạn hội thoại giả
      const newConversation = {
        mock: true, // Đánh dấu là đoạn hội thoại giả
        _id: Date.now().toString(), // Tạo ID duy nhất và chuyển đổi thành chuỗi
        lastMessage: {
          text: "This is a mock conversation. Start chatting now!",
          sender: "",
        },
        participants: [
          {
            _id: user._id, // Người dùng khác
            username: user.username,
            profilePic: user.profilePic,
          },
          {
            _id: currentUser._id, // Người dùng hiện tại
            username: currentUser.username,
            profilePic: currentUser.profilePic,
          },
        ],
      };

      // Thêm đoạn hội thoại giả vào danh sách
      setConversations((prevConvs) => [...prevConvs, newConversation]);

      // Đặt đoạn hội thoại giả làm đoạn hội thoại được chọn
      setSelectedConversation({
        _id: newConversation._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
        mock: true,
      });
    }

    // Chuyển hướng tới trang ChatPage
    navigate("/chat");
  };

  // Nếu là currentUser thì không hiển thị nút "Message"
  if (user._id === currentUser._id) {
    return null;
  }

  return (
    <Button onClick={handleMessageClick} size={"sm"} ml={2}>
      Message
    </Button>
  );
};

export default MessageButton;
