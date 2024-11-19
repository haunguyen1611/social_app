import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { IoSendSharp } from "react-icons/io5";
import React, { useState } from 'react'
import useShowToast from '../hooks/useShowToast.js';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messageAtom.js';


const MessageInput = ({setMessages}) => {
  const showToast = useShowToast();
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  // eslint-disable-next-line no-unused-vars
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const handleSendMessage = async (e) =>{
    e.preventDefault();
    if(!messageText) return;

    try {
      const res = await fetch("/api/messages",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      })
      const data = await res.json();
      if(data.error){
        showToast("Error",data.error,"error");
        return;
      }
      console.log(data);
      setMessages((messages) => [...messages, data]);

      setConversations(prevConvs => {
        const updatedConversations = prevConvs.map(conversation =>{
          if(conversation._id === selectedConversation._id){
            return {
              ...conversation,
              lastMessage:{
                text: messageText,
                sender: data.sender
              }
            }
          }
          return conversation;
        })
        return updatedConversations;
      })

      setMessageText("");

    } catch (error) {
      showToast("Error",error.message,"error");
    }
  }
  return (
    <form onSubmit={handleSendMessage}>
       <InputGroup>
            <Input w={'full'} placeholder='Type a message ...' onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
            />
            <InputRightElement onClick={handleSendMessage} cursor={"pointer"}> 
                <IoSendSharp color="green.500"/>
            </InputRightElement>
       </InputGroup>
    </form>
  )
}

export default MessageInput
