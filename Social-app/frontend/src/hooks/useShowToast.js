import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = useCallback(
    (tilte, description, status) => {
      toast({
        title: tilte,
        description: description,
        status: status,
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );
  return showToast;
};

export default useShowToast;
