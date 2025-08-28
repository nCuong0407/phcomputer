"use client";

import { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/vi";
import {
  MdModeEdit,
  MdChevronLeft,
  MdChevronRight,
  MdDelete,
  MdSearch,
  MdFilterList,
  MdRefresh,
} from "react-icons/md";
import {
  FaUsers,
  FaCrown,
  FaShieldAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import ChangeUserRole from "../components/ChangeUserRole";

moment.locale("vi");

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchData = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: "include",
      });
      const dataResponse = await fetchData.json();
      if (dataResponse.success) {
        setAllUsers(dataResponse.data);
      } else if (dataResponse.error) {
        setError(dataResponse.message);
        toast.error(dataResponse.message);
      }
    } catch (err) {
      const errorMessage = "Lỗi khi tải danh sách người dùng";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        // Simulate search delay for better UX
        setTimeout(() => {
          setIsSearching(false);
        }, 300);

        // Generate suggestions based on current search
        const suggestions = allUser
          .filter(
            (user) =>
              user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 5)
          .map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            type: user.name?.toLowerCase().includes(searchTerm.toLowerCase())
              ? "name"
              : "email",
          }));

        setSearchSuggestions(suggestions);
      } else {
        setSearchSuggestions([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, allUser]);

  // Search history management
  useEffect(() => {
    const savedHistory = localStorage.getItem("userSearchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleEditUser = (user) => {
    setUpdateUserDetails(user);
    setOpenUpdateRole(true);
  };

  const handleCloseModal = () => {
    setOpenUpdateRole(false);
    setUpdateUserDetails({
      email: "",
      name: "",
      role: "",
      _id: "",
    });
  };

  const handleDeleteUser = async (userId, userName) => {
    console.log("=== DELETE USER DEBUG ===");
    console.log("User ID:", userId);
    console.log("API URL:", `${SummaryApi.deleteUser.url}/${userId}`);
    console.log("Method:", SummaryApi.deleteUser.method);
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      try {
        const response = await fetch(`${SummaryApi.deleteUser.url}/${userId}`, {
          method: SummaryApi.deleteUser.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        const contentType = response.headers.get("content-type");
        console.log("Content-Type:", contentType);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (contentType && contentType.includes("application/json")) {
          const dataResponse = await response.json();
          console.log("Response data:", dataResponse);
          if (dataResponse.success) {
            toast.success(dataResponse.message || "Xóa người dùng thành công!");
            fetchAllUsers();
          } else {
            toast.error(dataResponse.message || "Lỗi khi xóa người dùng");
          }
        } else {
          const textResponse = await response.text();
          console.log("Response text (not JSON):", textResponse);
          if (
            textResponse.includes("<html>") ||
            textResponse.includes("<!DOCTYPE")
          ) {
            toast.error(
              "Server trả về HTML thay vì JSON - kiểm tra route backend"
            );
          } else {
            toast.error("Server trả về response không đúng format");
          }
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        if (error.message.includes("Failed to fetch")) {
          toast.error("Không thể kết nối tới server. Kiểm tra kết nối mạng.");
        } else if (error.message.includes("404")) {
          toast.error("API endpoint không tồn tại. Kiểm tra route backend.");
        } else if (error.message.includes("500")) {
          toast.error("Lỗi server nội bộ. Kiểm tra console backend.");
        } else {
          toast.error(`Lỗi khi xóa người dùng: ${error.message}`);
        }
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = allUser.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number.parseInt(event.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const addToSearchHistory = (term) => {
    if (term.trim() && !searchHistory.includes(term)) {
      const newHistory = [term, ...searchHistory.slice(0, 4)]; // Keep only 5 recent searches
      setSearchHistory(newHistory);
      localStorage.setItem("userSearchHistory", JSON.stringify(newHistory));
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("userSearchHistory");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addToSearchHistory(searchTerm.trim());
      setShowSuggestions(false);
      setCurrentPage(1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name || suggestion.email);
    addToSearchHistory(suggestion.name || suggestion.email);
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">
              Đang tải dữ liệu...
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <HiSparkles className="text-indigo-500 animate-bounce" />
              <p className="text-gray-600 font-medium">
                Vui lòng chờ trong giây lát
              </p>
              <HiSparkles className="text-purple-500 animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiLightningBolt className="text-white text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Oops! Có lỗi xảy ra
          </h3>
          <p className="text-red-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={fetchAllUsers}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Quản lý người dùng
                </h1>
                <p className="text-gray-600 font-medium">
                  Quản lý và theo dõi tất cả người dùng trong hệ thống
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            {/* <div className="flex space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{allUser.length}</div>
                  <div className="text-sm opacity-90">Tổng người dùng</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{allUser.filter((u) => u.role === "ADMIN").length}</div>
                  <div className="text-sm opacity-90">Quản trị viên</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Enhanced Search */}
            <div className="flex-1 max-w-md relative">
              <form onSubmit={handleSearchSubmit}>
                <div
                  className={`relative transition-all duration-300 ${
                    searchFocused ? "transform scale-105" : ""
                  }`}
                >
                  <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      setSearchFocused(true);
                      if (searchTerm.trim() || searchHistory.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setSearchFocused(false);
                      // Delay hiding suggestions to allow clicks
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 font-medium ${
                      searchFocused
                        ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />

                  {/* Clear button */}
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Loading indicator */}
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions &&
                (searchSuggestions.length > 0 || searchHistory.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-80 overflow-y-auto">
                    {/* Current search suggestions */}
                    {searchSuggestions.length > 0 && (
                      <div className="p-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                          <MdSearch className="mr-1" />
                          Kết quả tìm kiếm
                        </div>
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-200 flex items-center space-x-3 group"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {suggestion.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 group-hover:text-indigo-600">
                                {highlightText(
                                  suggestion.name || "N/A",
                                  searchTerm
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {highlightText(
                                  suggestion.email || "N/A",
                                  searchTerm
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {suggestion.type === "name" ? "Tên" : "Email"}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Search history */}
                    {searchHistory.length > 0 && !searchTerm.trim() && (
                      <div className="p-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Tìm kiếm gần đây
                          </div>
                          <button
                            onClick={clearSearchHistory}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            Xóa tất cả
                          </button>
                        </div>
                        {searchHistory.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchTerm(term);
                              setShowSuggestions(false);
                              setCurrentPage(1);
                            }}
                            className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-2 group"
                          >
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-indigo-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm text-gray-700 group-hover:text-indigo-600">
                              {term}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MdFilterList className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Hiển thị:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm font-medium text-gray-600">mục</span>
              </div>

              <button
                onClick={fetchAllUsers}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <MdRefresh className="text-lg" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>

          {/* Enhanced Results Info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                {searchTerm ? (
                  <div className="flex items-center space-x-2">
                    <span>
                      Tìm thấy{" "}
                      <span className="font-bold text-indigo-600">
                        {filteredUsers.length}
                      </span>{" "}
                      kết quả cho
                      <span className="font-bold text-indigo-600 mx-1">
                        "{searchTerm}"
                      </span>
                    </span>
                    {filteredUsers.length !== allUser.length && (
                      <span className="text-gray-500">
                        (từ tổng số {allUser.length} người dùng)
                      </span>
                    )}
                  </div>
                ) : (
                  <span>
                    Hiển thị{" "}
                    <span className="font-bold text-indigo-600">
                      {startIndex + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-bold text-indigo-600">
                      {Math.min(endIndex, filteredUsers.length)}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-bold text-indigo-600">
                      {filteredUsers.length}
                    </span>{" "}
                    người dùng
                  </span>
                )}
              </div>

              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">
                    <div className="flex items-center space-x-2">
                      <span>#</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-bold">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-sm" />
                      <span>Người dùng</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-bold">
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-sm" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-bold">
                    <div className="flex items-center justify-center space-x-2">
                      <FaShieldAlt className="text-sm" />
                      <span>Chức vụ</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-bold">
                    <div className="flex items-center justify-center space-x-2">
                      <FaCalendarAlt className="text-sm" />
                      <span>Ngày tạo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaUsers className="text-gray-400 text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-600 mb-1">
                            {searchTerm
                              ? `Không tìm thấy người dùng nào với từ khóa "${searchTerm}"`
                              : "Không có người dùng nào"}
                          </h3>
                          <p className="text-gray-500">
                            Danh sách người dùng sẽ hiển thị tại đây
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((el, index) => (
                    <tr
                      key={el._id || index}
                      className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {startIndex + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {el?.profilePic ? (
                              <img
                                src={el.profilePic || "/placeholder.svg"}
                                alt={`Avatar của ${el?.name || "người dùng"}`}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg ring-2 ring-indigo-500/20"
                                onError={(e) => {
                                  // Fallback khi ảnh lỗi - hiển thị chữ cái đầu tiên
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-indigo-500/20 ${
                                el?.profilePic ? "hidden" : "flex"
                              }`}
                              style={{
                                display: el?.profilePic ? "none" : "flex",
                              }}
                            >
                              {el?.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>

                            {/* Status indicator */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {highlightText(el?.name || "N/A", searchTerm)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {el?._id?.slice(-6) || "N/A"}
                            </div>
                            {el?.profilePic && (
                              <div className="text-xs text-green-600 font-medium flex items-center mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                {/* Có ảnh đại diện */}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {highlightText(el?.email || "N/A", searchTerm)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
                            el?.role === "ADMIN"
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                              : el?.role === "GENERAL"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                          }`}
                        >
                          {el?.role === "ADMIN" ? (
                            <>
                              <FaCrown className="mr-1 text-xs" />
                              ADMIN
                            </>
                          ) : (
                            <>
                              <FaShieldAlt className="mr-1 text-xs" />
                              {el?.role || "N/A"}
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {el?.createdAt
                            ? moment(el.createdAt).format("DD/MM/YYYY")
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {el?.createdAt
                            ? moment(el.createdAt).format("HH:mm")
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl group-hover:animate-pulse"
                            onClick={() => handleEditUser(el)}
                            aria-label={`Chỉnh sửa người dùng ${el?.name}`}
                          >
                            <MdModeEdit className="text-lg" />
                          </button>
                          <button
                            className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl group-hover:animate-pulse"
                            onClick={() => handleDeleteUser(el._id, el.name)}
                            aria-label={`Xóa người dùng ${el?.name}`}
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="text-sm text-gray-600 font-medium">
                Trang{" "}
                <span className="font-bold text-indigo-600">{currentPage}</span>{" "}
                /{" "}
                <span className="font-bold text-indigo-600">{totalPages}</span>
              </div>

              <div className="flex justify-center items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110"
                  }`}
                >
                  <MdChevronLeft size={20} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof pageNumber === "number" &&
                      handlePageChange(pageNumber)
                    }
                    disabled={pageNumber === "..."}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                      pageNumber === currentPage
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-110"
                        : pageNumber === "..."
                        ? "bg-transparent text-gray-400 cursor-default"
                        : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:shadow-lg hover:transform hover:scale-110"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110"
                  }`}
                >
                  <MdChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={handleCloseModal}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
