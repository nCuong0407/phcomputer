import React, { useState, useContext } from "react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const dataResponse = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataApi = await dataResponse.json();

      if (dataApi.requireOtpVerification) {
        toast.error(dataApi.message || "Tài khoản chưa được xác thực");
        navigate("/signup-otp-verification", {
          state: {
            email: dataApi.email,
            name: dataApi.name,
            fromLogin: true,
          },
        });
        return;
      }

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/");
        fetchUserDetails();
        fetchUserAddToCart();
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self");
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center 
  bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 
  p-6 relative"
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-gray-200">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center p-4 shadow-lg">
            <img
              src={loginIcons}
              alt="login icons"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Chào mừng trở lại
          </h1>
          <p className="text-gray-500 mt-2">Đăng nhập để tiếp tục</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              name="email"
              value={data.email}
              onChange={handleOnchange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                name="password"
                value={data.password}
                onChange={handleOnchange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition pr-12"
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-1xl text-gray-500 cursor-pointer hover:text-blue-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <Link
              to={"/forgot-password"}
              className="text-sm text-blue-600 font-medium hover:underline float-right mt-2"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Button section */}
          <div className="space-y-6 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-gray-900 to-gray-700 
                        text-white font-bold text-lg uppercase tracking-wide
                        rounded-xl shadow-lg relative overflow-hidden
                        transition-transform duration-300
                        hover:scale-[1.02] hover:shadow-2xl
                        active:scale-95
                        disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>

            <div className="flex items-center text-gray-400 text-sm font-medium">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 bg-white px-3 rounded-full">hoặc</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-4 px-6 flex items-center justify-center gap-3
                         bg-white border border-gray-300 rounded-xl font-bold text-gray-700 
                         uppercase tracking-wide shadow-md
                         hover:bg-gray-50 hover:shadow-xl transition-transform duration-300
                         active:scale-95"
            >
              <FaGoogle className="text-red-500" />
              Đăng nhập với Google
            </button>
          </div>
        </form>

        {/* Signup link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Chưa có tài khoản?
            <Link
              to={"/sign-up"}
              className="ml-2 text-blue-600 font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
