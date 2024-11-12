import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Message = ({ownMessage}) => {
  return (
    <>
    {ownMessage ? (

    <Flex gap={2} alignSelf={"flex-end"} >
        <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Alias reiciendis facere aspernatur. 
            Consectetur temporibus hic eos odit blanditiis, asperiores quaerat. 
            
        </Text>
    </Flex>
    ) : (
        <Flex gap={2} >
        <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Alias reiciendis facere aspernatur. 
        </Text>
    </Flex>
    )}
    </>
  )
}

export default Message
