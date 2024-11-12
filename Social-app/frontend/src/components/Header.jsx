import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom.js";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogOut from "../hooks/useLogout.js";
import { FaRegMessage } from "react-icons/fa6";
// import authScreenAtom from "../atoms/authAtom.js";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogOut();
  // const setAuthScreen = useRecoilState(authScreenAtom);
  return (
    <Flex justifyContent={user ? "space-between" : "center"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        cursor="pointer"
        alt="logo"
        w={7}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <FaRegMessage size={18} />
					</Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
      
    </Flex>
  );
};

export default Header;
