import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";
const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally{
        setLoading(false)
      }
    };
    getUser();
  }, [username, showToast]);

  if(!user && loading){
    return (
      <Flex justifyContent="center">
        <Spinner size="xl"/>
      </Flex>
    )
  }
  if (!user) return <h1>User not found</h1>;
  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={123}
        postImg="/post1.png"
        postTitle="Let's talk about Threads"
      />
      <UserPost
        likes={1312}
        replies={319}
        postImg="/post2.png"
        postTitle="Nice Tutorial"
      />
      <UserPost
        likes={4321}
        replies={723}
        postImg="/post3.png"
        postTitle="I love this guy"
      />
      <UserPost
        likes={2312}
        replies={189}
        postImg="/t1.webp"
        postTitle="this is my first thread"
      />
    </>
  );
};

export default UserPage;
