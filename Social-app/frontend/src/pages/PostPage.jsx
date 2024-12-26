import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast.js";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom.js";
const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const currentPost = posts.length > 0 ? posts[0] : null;

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }

        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();

      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Delete", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user || loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user?.profilePic}
            size="md"
            name={user?.name}
            onClick={() => {
              console.log("Avatar clicked!")
              navigate(`/${user.username}`);
            }}
            cursor={"pointer"}
          />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} w={36} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser && user && currentUser._id === user._id && (
            <DeleteIcon cursor={"pointer"} onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {currentPost.replies?.map((reply, index) => (
        <Comment
          key={reply._id || index} // Nếu không có _id, sử dụng index
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
