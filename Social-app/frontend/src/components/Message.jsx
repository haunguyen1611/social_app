import { Box, Flex, Text, Image, Skeleton } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messageAtom.js";
import React, { useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { useRecoilValue } from "recoil";

const Message = ({ ownMessage, message }) => {
  // eslint-disable-next-line no-unused-vars
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text && (
            <Flex bg={"blue.500"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message.text}</Text>
              {message.seen && (
                <Box
                  alignSelf={"flex-end"}
                  ml={1}
                  color={"gray.100"}
                  fontWeight={"bold"}
                >
                  <BsCheck2All size={16} />
                </Box>
              )}
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"} wrap="wrap" >
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex gap={2}>
          {message.text && (
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
              {message.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"} wrap="wrap" >
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
