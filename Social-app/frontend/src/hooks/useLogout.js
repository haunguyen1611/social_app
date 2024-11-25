import userAtom from '../atoms/userAtom.js';
import React from 'react'
import { useSetRecoilState } from 'recoil';
import useShowToast from './useShowToast';
import { useNavigate } from 'react-router-dom';

const useLogOut = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const logout = async () => {
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
          navigate("/auth");
        } catch (error) {
          showToast("Error", error, "error");
        }
      };

      return logout;
}

export default useLogOut;
