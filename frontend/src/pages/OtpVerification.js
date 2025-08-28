import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/index";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const [loadingResend, setLoadingResend] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();

  // Kiểm tra nếu không có email từ trang trước thì quay lại forgot-password
  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  // Kiểm tra tất cả các ô OTP đã nhập chưa
  const valideValue = data.every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.verifyForgotPasswordOtp,
        data: {
          otp: data.join(""), // ghép chuỗi OTP
          email: location?.state?.email,
        },
      });

      if (response.data.error) {
        toast.error(response.data.message || "OTP không đúng hoặc đã hết hạn");
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message || "Xác thực OTP thành công");
        setData(["", "", "", "", "", ""]);

        const otpCode = data.join(""); // OTP đầy đủ

        // Điều hướng sang trang đổi mật khẩu và gửi email kèm theo
        navigate("/reset-password", {
          state: {
            email: location?.state?.email,
            otp: otpCode,
          },
        });
      }
    } catch (error) {
      console.log("error", error);
      AxiosToastError(error);
      console.log("Email nhận từ ForgotPassword:", location?.state?.email);
      console.log("OTP nhập:", data.join(""));
    }
  };

  // 👉 Hàm gửi lại OTP
  const handleResendOtp = async () => {
    try {
      setLoadingResend(true);

      const response = await Axios({
        ...SummaryApi.resendForgotPasswordOtp, // 👈 API resend (backend đã tạo)
        data: { email: location?.state?.email },
      });

      if (response.data.success) {
        toast.success(response.data.message || "OTP mới đã được gửi!");
      } else {
        toast.error(response.data.message || "Không thể gửi lại OTP");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Nhập mã OTP</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp">Nhập mã OTP của bạn:</label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {data.map((element, index) => (
                <input
                  key={"otp" + index}
                  type="text"
                  id="otp"
                  ref={(ref) => {
                    inputRef.current[index] = ref;
                    return ref;
                  }}
                  value={data[index]}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ""); // chỉ cho nhập số
                    const newData = [...data];
                    newData[index] = value;
                    setData(newData);

                    // Tự động chuyển sang ô tiếp theo khi nhập
                    if (value && index < 5) {
                      inputRef.current[index + 1].focus();
                    }
                  }}
                  maxLength={1}
                  className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold"
                />
              ))}
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={` ${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Xác thực OTP
          </button>
        </form>

        {/* Nút Gửi lại OTP */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loadingResend}
            className={`text-sm font-semibold ${
              loadingResend
                ? "text-gray-400"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            {loadingResend ? "Đang gửi..." : "Gửi lại OTP"}
          </button>
        </div>

        <p className="mt-3">
          Đã có tài khoản?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
