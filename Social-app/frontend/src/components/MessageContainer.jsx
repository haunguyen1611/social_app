import {
  Avatar,
  Flex,
  useColorModeValue,
  Text,
  Image,
  Divider,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import useShowToast from "../hooks/useShowToast.js";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messageAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { useSocket } from "../context/SocketContext";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const [, setConversations] = useRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
useEffect(() => {
  socket.on("newMessage", (message) => {
    // Chỉ thêm tin nhắn mới vào hội thoại hiện tại
    if (selectedConversation._id === message.conversationId) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }

    // Cập nhật lastMessage cho các hội thoại
    setConversations((prevConvs) => {
      const updatedConversations = prevConvs.map((conv) => {
        if (conv._id === message.conversationId) {
          return {
            ...conv,
            lastMessage: {
              text: message.text,
              sender: message.sender,
            },
          };
        }
        return conv;
      });
      return updatedConversations;
    });
  });

  // Dọn sạch event listener khi component bị huỷ
  return () => socket.off("newMessage");
}, [selectedConversation, setConversations, socket]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) {
          // Mock data for the conversation
          setMessages([
            {
              _id: "1",
              text: "",
              sender: selectedConversation.userId,
              createdAt: new Date().toISOString(),
              seen: true,
            },
            {
              _id: "2",
              text: "",
              sender: currentUser._id,
              createdAt: new Date().toISOString(),
              seen: true,
            },
          ]);
          setLoadingMessages(false);
          return;
        }

        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation, currentUser._id]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={4}
    >
      {/* Message Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username} {" "}
        </Text>
        <Image src="/verified.png" w={4} h={4} ml={1} />
      </Flex>
      <Divider />
      {/* Message */}
      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        px={2}
        height={"400px"}
        overflowY={"auto"}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={2}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size="7" />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w={"250px"} />
                <Skeleton h="8px" w={"250px"} />
                <Skeleton h="8px" w={"250px"} />
              </Flex>
            </Flex>
          ))}

        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
