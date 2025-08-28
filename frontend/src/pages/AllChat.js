"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AllChat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // ✅ hiển thị tối đa 10 sản phẩm / trang

  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await fetch(SummaryApi.getAllChatController.url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data?.success) {
        // ✅ Sắp xếp chat theo createdAt mới nhất
        const sortedChats = (data.chats || data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setChats(sortedChats);
        setTotalPages(Math.ceil(sortedChats.length / limit));
        setPage(1); // luôn reset về trang đầu khi load mới
      } else {
        toast.error(data.message || "Không lấy được danh sách chat");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tải chat:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hàm xoá bình luận
  const handleDelete = async (chatId) => {
    if (!window.confirm("Bạn có chắc muốn xoá bình luận này?")) return;
    try {
      const res = await fetch(
        `${SummaryApi.deleteChatController.url}/${chatId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data?.success) {
        toast.success("Đã xoá bình luận");
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      } else {
        toast.error(data.message || "Xoá thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi khi xoá bình luận:", err);
      toast.error("Lỗi khi xoá bình luận");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Lấy dữ liệu của trang hiện tại
  const startIndex = (page - 1) * limit;
  const currentChats = chats.slice(startIndex, startIndex + limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Quản lý bình luận sản phẩm
                </h1>
                <p className="text-slate-600 mt-1 text-lg">
                  Quản lý và theo dõi phản hồi khách hàng
                </p>
              </div>
            </div>

            <button
              onClick={fetchChats}
              disabled={loading}
              className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            >
              <div className="flex items-center gap-2">
                <svg
                  className={`w-5 h-5 ${
                    loading ? "animate-spin" : "group-hover:rotate-180"
                  } transition-transform duration-300`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Làm mới</span>
              </div>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 text-lg font-medium">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Chưa có bình luận nào
              </h3>
              <p className="text-slate-500">
                Các bình luận từ khách hàng sẽ xuất hiện tại đây
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {currentChats.map((chat) => (
                <div
                  key={chat._id}
                  className="group bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >
                  {/* Product name with enhanced styling */}
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200 flex items-center gap-2 group-hover:gap-3"
                      onClick={() => navigate(`/product/${chat.productId}`)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <span className="hover:underline transition-all duration-200">
                        {chat.productName}
                      </span>
                    </h3>
                  </div>

                  {/* Comment content with enhanced design */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-5 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {chat.userName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-800 text-lg">
                            {chat.userName}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Khách hàng
                          </span>
                        </div>
                        <p className="text-slate-700 text-base leading-relaxed mb-3">
                          {chat.message}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {new Date(chat.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons with enhanced styling */}
                  <div className="flex items-center gap-4">
                    <button
                      className="group/btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={() => navigate(`/product/${chat.productId}`)}
                    >
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>Xem toàn bộ bình luận</span>
                    </button>

                    <button
                      className="group/btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={() => handleDelete(chat._id)}
                    >
                      <svg
                        className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Xóa bình luận</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 mt-8">
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-medium rounded-xl hover:from-blue-500 hover:to-indigo-600 hover:text-white transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:from-slate-100 disabled:hover:to-slate-200 disabled:hover:text-slate-700"
                >
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Trang trước</span>
                </button>

                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg">
                  <span className="text-lg">Trang {page}</span>
                  <span className="text-blue-200">/</span>
                  <span className="text-lg">{totalPages}</span>
                </div>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-medium rounded-xl hover:from-blue-500 hover:to-indigo-600 hover:text-white transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:from-slate-100 disabled:hover:to-slate-200 disabled:hover:text-slate-700"
                >
                  <span>Trang sau</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllChat;
