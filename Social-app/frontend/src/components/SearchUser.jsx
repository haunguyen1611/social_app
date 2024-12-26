import { Input, Button, Flex, InputGroup, InputRightElement, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const {colorMode} = useColorMode();
  const handleSearch = () => {
    if (query.trim() === "") return;
    // Điều hướng đến trang cá nhân của người dùng
    navigate(`/${query}`);

    setQuery("")
  };

  return (
    <Flex gap={2} alignItems="center" w="100%">
      <InputGroup>
        <Input
          placeholder="Search user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          w="100%"  // Đặt chiều rộng của input là 70px
        />
        <InputRightElement>
        <Button
            onClick={handleSearch}
            colorScheme="blue"
            variant="link" 
            size="sm"
            aria-label="Search"
          color={colorMode === "light" ? "black" : "white"} 
          borderColor={colorMode === "light" ? "black" : "white"}
          >
            <FiSearch size={20} /> {/* Biểu tượng tìm kiếm */}
          </Button>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default SearchUser;
