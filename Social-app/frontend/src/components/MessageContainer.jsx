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
import React from "react";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
// import { useRecoilState } from "recoil";

const MessageContainer = () => {
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
        <Avatar src="" size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          johndoe <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
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
        {![...Array(5)].map((_, i) => (
          <Flex
            key={i}
            gap={2}
            alignItems={"center"}
            p={2}
            borderRadius={"md"}
            alignSelf={i % 2 == 0 ? "flex-start" : "flex-end"}
          >
            {i % 2 == 0 && <SkeletonCircle size="7"/> }
            <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w={"250px"}/>
                <Skeleton h="8px" w={"250px"}/>
                <Skeleton h="8px" w={"250px"}/>
            </Flex>
          </Flex>
        ))}
        
        <Message ownMessage={true}/>
        <Message ownMessage={false}/>
        <Message ownMessage={true}/>

      </Flex>
      <MessageInput/>
    </Flex>
  );
};

export default MessageContainer;
