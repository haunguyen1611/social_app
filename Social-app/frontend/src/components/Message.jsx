import { Flex, Text } from '@chakra-ui/react'
// import { selectedConversationAtom } from '../atoms/messageAtom.js'
import React from 'react'
// import { useRecoilValue } from 'recoil'
// import userAtom from '../atoms/userAtom.js'

const Message = ({ownMessage, message}) => {
  // const selectedConversation = useRecoilValue(selectedConversationAtom);
  // const currentUser = useRecoilValue(userAtom);
  return (
    <>
    {ownMessage ? (

    <Flex gap={2} alignSelf={"flex-end"} >
        <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
          {message.text}
            
        </Text>
    </Flex>
    ) : (
        <Flex gap={2} >
        <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
            {message.text}
        </Text>
    </Flex>
    )}
    </>
  )
}

export default Message
