import { Avatar, Flex, Text, Image, Box, Divider, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
const PostPage = () => {
  const [liked,setliked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark Zukerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              markzukerberg
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>Let&apos;s talk about Threads.</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={"/post1.png"} w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setlike={setliked}/>
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>238 replies</Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1:0)} likes
        </Text>
      </Flex>
      <Divider my={4}/>

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4}/>
      <Comment 
      comment="Look really good!"
      createdAt ="2"
      likes ={100}
      username = "johndoe"
      userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment 
      comment="Siuuuuuuuu!"
      createdAt ="2"
      likes ={23}
      username = "cristiano"
      userAvatar="https://th.bing.com/th/id/R.e39f6a9596137e57460a80c05496a4d2?rik=5BgUkrfJ1V97aw&pid=ImgRaw&r=0"
      /><Comment 
      comment="Okayyyy!"
      createdAt ="2"
      likes ={41}
      username = "sallydoe"
      userAvatar="https://bit.ly/dan-abramov"
      />
    </>
  );
};

export default PostPage;
