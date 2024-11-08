import { useToast } from '@chakra-ui/react'
import React from 'react'

const useShowToast = () => {
    const toast = useToast()
    const showToast= (tilte,description,status)=>{
        toast({
            title: tilte,
            description: description,
            status: status,
            duration: 3000,
            isClosable: true
        })
    }
  return showToast
}

export default useShowToast
