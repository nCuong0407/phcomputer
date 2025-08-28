"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/vi";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaIdBadge,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaStar,
  FaShieldAlt,
  FaCrown,
  FaHeart,
  FaGem,
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import SummaryApi from "../common";
import imageToBase64 from "../helpers/imageTobase64";
import { setUserDetails } from "../store/userSlice";

moment.locale("vi");

const UserProfilePremium = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  const [userDetails, setUserDetailsLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: "",
  });

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // Debug state
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
    setTimeout(() => setIsVisible(true), 100);
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUserDetailsLocal(data.data);
        setFormData({
          name: data.data.name || "",
          email: data.data.email || "",
          profilePic: data.data.profilePic || "",
        });
      } else {
        setError(data.message || "Lỗi khi tải thông tin người dùng");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Lỗi khi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // DEBUG VERSION - Thêm nhiều logs
  const handleImageChange = async (e) => {
    console.log("🔥 handleImageChange called!");
    console.log("Event:", e);
    console.log("Files:", e.target.files);

    setDebugInfo("Image change triggered!");

    const file = e.target.files[0];
    if (file) {
      console.log("📁 File selected:", file.name, file.size, file.type);
      setDebugInfo(`File selected: ${file.name}`);

      try {
        setUploadingImage(true);
        console.log("🔄 Starting upload process...");

        // Hiển thị preview ngay lập tức
        const reader = new FileReader();
        reader.onload = (event) => {
          console.log("📷 Preview loaded");
          setFormData((prev) => ({
            ...prev,
            profilePic: event.target.result,
          }));
        };
        reader.readAsDataURL(file);

        // Convert to base64 cho việc upload
        console.log("🔄 Converting to base64...");
        const image = await imageToBase64(file);
        console.log("✅ Base64 conversion complete");

        setFormData((prev) => ({
          ...prev,
          profilePic: image,
        }));

        setDebugInfo("Image processed successfully!");
        toast.success("Ảnh đã được tải lên!");
      } catch (error) {
        console.error("❌ Error processing image:", error);
        setDebugInfo(`Error: ${error.message}`);
        toast.error("Lỗi khi xử lý ảnh");
      } finally {
        setUploadingImage(false);
        console.log("🏁 Upload process finished");
      }
    } else {
      console.log("❌ No file selected");
      setDebugInfo("No file selected");
    }
  };

  // Test function để debug
  const testImageUpload = () => {
    console.log("🧪 Test image upload clicked");
    setDebugInfo("Test button clicked!");
    document.getElementById("imageInput").click();
  };

  const handleSave = async () => {
    try {
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userDetails._id,
          name: formData.name,
          email: formData.email,
          profilePic: formData.profilePic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("🎉 Cập nhật thông tin thành công!");

        const updatedUserDetails = {
          ...userDetails,
          name: formData.name,
          email: formData.email,
          profilePic: formData.profilePic,
        };

        setUserDetailsLocal(updatedUserDetails);
        dispatch(setUserDetails(updatedUserDetails));
        setIsEditing(false);
      } else {
        toast.error(data.message || "Lỗi khi cập nhật thông tin");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Lỗi khi cập nhật thông tin");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      profilePic: userDetails?.profilePic || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
            <div className="absolute inset-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-sm opacity-50 animate-pulse"></div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white mb-2">
              Đang tải thông tin...
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <HiSparkles className="text-purple-400 animate-bounce" />
              <p className="text-purple-200 font-medium">
                Xin chờ trong giây lát.
              </p>
              <HiSparkles className="text-blue-400 animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="text-center bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md mx-4 border border-white/20 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Oops! Có lỗi xảy ra
          </h3>
          <p className="text-red-200 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={fetchUserDetails}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2 mx-auto"
          >
            <HiLightningBolt className="text-lg" />
            <span>Thử lại ngay</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>

        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div
        className={`max-w-4xl mx-auto px-4 py-6 relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <button onClick={testImageUpload}></button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <HiSparkles className="text-yellow-400 text-2xl animate-spin" />
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Thông tin cá nhân
            </h1>
            <HiSparkles
              className="text-yellow-400 text-2xl animate-spin"
              style={{ animationDirection: "reverse" }}
            />
          </div>
          <p className="text-lg text-purple-200 font-medium">
            ✨ Quản lý và cập nhật thông tin của bạn một cách tuyệt vời ✨
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01]">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-6 py-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-indigo-600/80"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-2 left-2 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-2xl animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse delay-300"></div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full ring-4 ring-white/30 overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-md opacity-50 animate-pulse"></div>

                    {uploadingImage ? (
                      <div className="w-full h-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center relative z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      </div>
                    ) : (
                      <img
                        src={
                          formData.profilePic ||
                          "/placeholder.svg?height=96&width=96&query=user+avatar"
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 relative z-10"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=96&width=96";
                        }}
                      />
                    )}
                  </div>

                  {/* IMPROVED Camera Overlay */}
                  {isEditing && (
                    <>
                      {/* Hidden Input */}
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                      />

                      {/* Visible Overlay */}
                      <label
                        htmlFor="imageInput"
                        className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20"
                        onClick={(e) => {
                          console.log("🖱️ Camera overlay clicked!");
                          setDebugInfo("Camera overlay clicked!");
                          e.preventDefault();
                          document.getElementById("imageInput").click();
                        }}
                      >
                        <div className="text-center">
                          <FaCamera className="text-white text-xl mb-1 animate-bounce" />
                          <span className="text-white text-xs font-medium">
                            Thay đổi
                          </span>
                        </div>
                      </label>

                      {/* Fallback Button - Always Visible in Edit Mode */}
                      <button
                        onClick={() => {
                          console.log("🔘 Fallback button clicked!");
                          setDebugInfo("Fallback button clicked!");
                          document.getElementById("imageInput").click();
                        }}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-30"
                      >
                        <FaCamera className="text-white text-xs" />
                      </button>
                    </>
                  )}

                  {/* Status Indicator */}
                  {!isEditing && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <FaHeart className="text-white text-sm" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="text-center lg:text-left text-white space-y-3">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      {userDetails?.name || "Chưa cập nhật"}
                    </h2>
                    <p className="text-lg text-blue-100 font-medium flex items-center justify-center lg:justify-start space-x-2">
                      <FaEnvelope className="text-sm" />
                      <span>{userDetails?.email}</span>
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div className="inline-flex items-center space-x-2">
                    <div
                      className={`px-3 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg ${
                        userDetails?.role === "ADMIN"
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      }`}
                    >
                      {userDetails?.role === "ADMIN" ? (
                        <>
                          <FaCrown className="text-sm animate-bounce" />
                          <span>Quản trị viên</span>
                          <FaGem className="text-sm animate-pulse" />
                        </>
                      ) : (
                        <>
                          <FaShieldAlt className="text-sm" />
                          <span>Người dùng</span>
                          <FaStar className="text-sm animate-pulse" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                {!isEditing ? (
                  <button
                    onClick={() => {
                      console.log("✏️ Edit button clicked!");
                      setIsEditing(true);
                      setDebugInfo("Edit mode activated!");
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-5 py-2 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-105 group"
                  >
                    <FaEdit className="text-sm group-hover:animate-bounce" />
                    <span>Chỉnh sửa</span>
                    <HiSparkles className="text-sm group-hover:animate-spin" />
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-105 group"
                    >
                      <FaSave className="text-sm group-hover:animate-bounce" />
                      <span>Lưu</span>
                      <HiLightningBolt className="text-sm group-hover:animate-pulse" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-105 group"
                    >
                      <FaTimes className="text-sm group-hover:animate-spin" />
                      <span>Hủy</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Name Field */}
              <div
                className="space-y-3 group"
                onMouseEnter={() => setActiveField("name")}
                onMouseLeave={() => setActiveField(null)}
              >
                <label className="flex items-center text-base font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                      activeField === "name"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-110"
                        : "bg-blue-500/20"
                    }`}
                  >
                    <FaUser className="text-white text-sm" />
                  </div>
                  Họ và tên
                  {activeField === "name" && (
                    <HiSparkles className="ml-2 text-yellow-400 animate-spin text-sm" />
                  )}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 text-white font-medium placeholder-white/50"
                    placeholder="Nhập họ và tên của bạn..."
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                    {userDetails?.name || "Chưa cập nhật"}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div
                className="space-y-3 group"
                onMouseEnter={() => setActiveField("email")}
                onMouseLeave={() => setActiveField(null)}
              >
                <label className="flex items-center text-base font-bold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                      activeField === "email"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 scale-110"
                        : "bg-green-500/20"
                    }`}
                  >
                    <FaEnvelope className="text-white text-sm" />
                  </div>
                  Email
                  {activeField === "email" && (
                    <HiSparkles className="ml-2 text-yellow-400 animate-spin text-sm" />
                  )}
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20 transition-all duration-300 text-white font-medium placeholder-white/50"
                    placeholder="Nhập email của bạn..."
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                    {userDetails?.email || "Chưa cập nhật"}
                  </div>
                )}
              </div>

              {/* Role Field */}
              <div
                className="space-y-3 group"
                onMouseEnter={() => setActiveField("role")}
                onMouseLeave={() => setActiveField(null)}
              >
                <label className="flex items-center text-base font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                      activeField === "role"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-110"
                        : "bg-purple-500/20"
                    }`}
                  >
                    <FaIdBadge className="text-white text-sm" />
                  </div>
                  Chức vụ
                  {activeField === "role" && (
                    <HiSparkles className="ml-2 text-yellow-400 animate-spin text-sm" />
                  )}
                </label>
                <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${
                      userDetails?.role === "ADMIN"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : userDetails?.role === "GENERAL"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                    }`}
                  >
                    {userDetails?.role === "ADMIN" ? (
                      <>
                        <FaCrown className="mr-2 animate-bounce text-sm" />
                        ADMIN
                        <FaGem className="ml-2 animate-pulse text-sm" />
                      </>
                    ) : (
                      <>
                        <FaShieldAlt className="mr-2 text-sm" />
                        {userDetails?.role || "Chưa cập nhật"}
                        <FaStar className="ml-2 animate-pulse text-sm" />
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Created Date Field */}
              <div
                className="space-y-3 group"
                onMouseEnter={() => setActiveField("date")}
                onMouseLeave={() => setActiveField(null)}
              >
                <label className="flex items-center text-base font-bold text-white mb-3 group-hover:text-orange-300 transition-colors duration-300">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                      activeField === "date"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 scale-110"
                        : "bg-orange-500/20"
                    }`}
                  >
                    <FaCalendarAlt className="text-white text-sm" />
                  </div>
                  Ngày tạo tài khoản
                  {activeField === "date" && (
                    <HiSparkles className="ml-2 text-yellow-400 animate-spin text-sm" />
                  )}
                </label>
                <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                  {userDetails?.createdAt
                    ? moment(userDetails.createdAt).format("DD/MM/YYYY HH:mm")
                    : "Chưa cập nhật"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20">
            <HiSparkles className="text-yellow-400 animate-spin text-sm" />
            <span className="text-white font-medium text-sm">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
            </span>
            <FaHeart className="text-red-400 animate-pulse text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePremium;
