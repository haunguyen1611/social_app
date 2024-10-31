import React from 'react';
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return (
  <>
  <UserHeader />
  <UserPost likes={1200} replies={123} postImg="/post1.png" postTitle="Let's talk about Threads" />
  <UserPost likes={1312} replies={319} postImg="/post2.png" postTitle="Nice Tutorial" />
  <UserPost likes={4321} replies={723} postImg="/post3.png" postTitle="I love this guy" />
  <UserPost likes={2312} replies={189} postImg="/t1.webp" postTitle="this is my first thread" />
  </>
  )
}

export default UserPage
