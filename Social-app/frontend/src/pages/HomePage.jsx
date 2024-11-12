import React, { useEffect, useState } from 'react'
import { Flex, Spinner} from "@chakra-ui/react";
import useShowToast from '../hooks/useShowToast.js';
import Post from '../components/Post.jsx';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom.js';

const HomePage = () => {
  const [posts,setPosts] = useRecoilState(postsAtom)
  const [loading,setLoading] = useState(false);
  const showToast = useShowToast();
  useEffect(() =>{
    const getFeedPost = async() =>{
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error")
        }
        console.log(data);  
        setPosts(data);
      } catch (error) {
          showToast("Error",error.message,"error");
      } finally{
        setLoading(false);
      }
    }
    getFeedPost();
  },[showToast,setPosts])
  return (
    <>
      {!loading && posts.length === 0 && <h1>Follow some users to see new feed</h1>}

      {loading &&(
        <Flex justifyContent={"center"}>
          <Spinner size={'xl'}/>
        </Flex>
      )}

      {posts.map((post) =>(
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
    </>
  )
}

export default HomePage
