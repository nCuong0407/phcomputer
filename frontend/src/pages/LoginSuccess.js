import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../context";
import { toast } from "react-toastify";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/auth/login/success`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.success) {
          toast.success("Đăng nhập Google thành công 🎉");
          fetchUserDetails();
          fetchUserAddToCart();
          navigate("/");
        } else {
          toast.error("Đăng nhập Google thất bại");
          navigate("/login");
        }
      } catch (err) {
        console.error("Google login error", err);
        toast.error("Có lỗi khi đăng nhập Google");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, fetchUserDetails, fetchUserAddToCart]);

  return <div className="text-center p-10">Đang xử lý đăng nhập Google...</div>;
};

export default LoginSuccess;
