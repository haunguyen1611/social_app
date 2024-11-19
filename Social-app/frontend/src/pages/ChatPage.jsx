import { SearchIcon } from "@chakra-ui/icons";
import { SiTheconversation } from "react-icons/si";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import React, { useEffect, useState } from "react";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messageAtom.js";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {

  const showToast = useShowToast()
  const [loadingConversations,setLoadingConversations] = useState(true); 
  const [conversations,setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const {socket,onlineUsers} = useSocket(); 
  useEffect(() => {
    const getConversations = async () =>{
      try {
          const res = await fetch("/api/messages/conversations");
          const data = await res.json();
          if(data.error){
            showToast("Error",data.error,"error");
            return;
          }
          console.log(data)
          setConversations(data);
      } catch (error) {
          showToast("Error",error.message,"error");
      } finally{
        setLoadingConversations(false);
      }
    }
    getConversations();
  },[setConversations,showToast]);

  const handleConversationSearch = async (e) =>{
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`)
      const searchedUser = await res.json();
      if(searchedUser.error){
        showToast("Error",searchedUser.error,"error");
        return;
      }

      // user is trying to message themselves 
      if(searchedUser._id === currentUser._id){
        showToast("Error","You can't message yourself","error");
        return;
      }

      // user and the searchedUser have a conversation before
      if(conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)){
        setSelectedConversation({
          _id: conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)._id,
          userId : searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
          mock: false,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id : searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          }
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation])
    } catch (error) {
      showToast("Error",error.message,"error");
    } finally{
      setSearchingUser(false);
    }
  }
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={"700"}
            color={useColorModeValue("gray.600", "gray.300")}
          >
            Your conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search" onChange={(e) => setSearchText(e.target.value)}/>
              <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {
            loadingConversations && [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}></Flex>
                <Skeleton h={"10px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90%"} />
              </Flex>
            ))
          }

          {!loadingConversations && (
            conversations.map(conversation => (
              <Conversation key={conversation._id}
              isOnline = {onlineUsers.includes(conversation.participants[0]._id)}
              conversation={conversation}/>
            ))
          )}
        </Flex>
        {!selectedConversation._id && (
        <Flex
          flex={70}
          borderRadius={"md"}
          p={2}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"400px"}
        >
          <SiTheconversation size={100} />
          <Text fontSize={20}>Select a conversation</Text>
        </Flex>
        )}

        {selectedConversation._id && <MessageContainer/>}

      </Flex>
    </Box>
  );
};

export default ChatPage;
