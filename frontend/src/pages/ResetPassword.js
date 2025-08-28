import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/index";
import AxiosToastError from "../utils/AxiosToastError";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location?.state?.email;
  const otp = location?.state?.otp;

  // Nếu không có email, quay lại forgot-password
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: {
          email: email,
          otp: otp,
          newPassword: password,
          confirmPassword: confirmPassword
        },
      });

      if (response.data.error) {
        toast.error(response.data.message || "Đổi mật khẩu thất bại");
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message || "Đổi mật khẩu thành công");

        // Chờ 1.5 giây rồi mới điều hướng
        setTimeout(() => {
          navigate("/login");
        }, 1500);
}
    } catch (error) {
      console.log("error", error);
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Đặt lại mật khẩu</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="password">Mật khẩu mới:</label>
            <input
              type="password"
              id="password"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <button
            className="bg-green-800 hover:bg-green-700 text-white py-2 rounded font-semibold my-3 tracking-wide"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
