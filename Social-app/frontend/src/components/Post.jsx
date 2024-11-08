import { Link, useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { Box, Text, Image } from "@chakra-ui/react";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import React from "react";
import useShowToast from "../hooks/useShowToast.js";
import {formatDistanceToNow} from "date-fns";

const Post = ({ post, postedBy }) => {
    const [user,setUser] = useState(null);
    const [liked, setliked] = useState(false);
    const showToast = useShowToast();
    
    const navigate = useNavigate();

    useEffect(()=>{
        const getUser = async() => {
            try {
                const res = await fetch("/api/users/profile/"+ postedBy);
                const data = await res.json();
                console.log(data);
                if(data.error){
                    showToast("Error",data.error,"error");
                    return;
                }
                setUser(data)
            } catch (error) {
                showToast("Error",error.message,"error");
                setUser(null);
            }
        }
        getUser()
    },[postedBy,showToast])

    if (!user) {
        return <Text>Loading...</Text>;
    }
    return (
      <Link to={`${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar size="md" name={user?.name} src={user?.profilePic }
            onClick={(e)=>{
                e.preventDefault();
                navigate(`${user.username}`)
            }}
            />
            <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
            <Box position={"relative"} w={"full"}>
                {post.replies.length ===0 && <Text textAlign={"center"}>😶</Text>}
                {post.replies[0]&&(
                    <Avatar
                    size="xs"
                    name="John Doe"
                    src={post.replies[0].userProfilePic}
                    position={"absolute"}
                    top={"0px"}
                    left={"15px"}
                    padding={"2px"}
                  />
                )}
                {post.replies[1]&&(
                    <Avatar
                    size="xs"
                    name="John Doe"
                    src={post.replies[1].userProfilePic}
                    position={"absolute"}
                    bottom={"0px"}
                    right={"-5px"}
                    padding={"2px"}
                  />
                )}
              {post.replies[2]&&(
                    <Avatar
                    size="xs"
                    name="John Doe"
                    src={post.replies[2].userProfilePic}
                    position={"absolute"}
                    bottom={"0px"}
                    right={"-5px"}
                    padding={"2px"}
                  />
                )}
            </Box>
          </Flex>
          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}
                onClick={(e)=>{
                    e.preventDefault();
                    navigate(`${user.username}`)}}
                >
                  {user?.username}
                </Text>
                <Image src="/verified.png" w={4} h={4} ml={1}></Image>
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text fontSize={"sm"} w={36} textAlign={"right"} color={"gray.light"}>
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>
              </Flex>
            </Flex>
            <Text fontSize={"sm"}>{post.text}</Text>
            {post.img && (
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={post.img} w={"full"} />
              </Box>
            )}
  
            <Flex gap={3} my={1}>
              <Actions liked={liked} setlike={setliked} />
            </Flex>
  
            <Flex gap={2} alignItems={"center"}>
              <Text color={"gray.light"} fontSize={"sm"}>{post.replies?.length} replies</Text>
              <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
              <Text color={"gray.light"} fontSize={"sm"}>{post.likes?.length} likes</Text>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    );
  };
  
  export default Post;
  
