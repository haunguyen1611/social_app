import { Button } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom.js";
import React from "react";
import { useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast.js";
import { FiLogOut } from "react-icons/fi";
const LogoutButton = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handdleLogout = async () => {
    try {
      localStorage.removeItem("user-threads");
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handdleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
