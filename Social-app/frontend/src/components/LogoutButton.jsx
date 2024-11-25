import { Button } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom.js";
import React from "react";
import { useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast.js";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const LogoutButton = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();
  const handdleLogout = async () => {
    try {
      // Xóa dữ liệu cục bộ
      localStorage.removeItem("user-threads");
      // Gửi yêu cầu logout tới server
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // Xử lý lỗi từ server
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // Xóa thông tin user và điều hướng đến trang /auth
      setUser(null);
      navigate("/auth");
    } catch (error) {
      // Xử lý lỗi cục bộ
      showToast("Error", error.message || "Logout failed", "error");
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
