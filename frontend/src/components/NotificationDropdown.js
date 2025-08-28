import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";

const NotificationDropdown = ({ onClose, onClearBadge }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(SummaryApi.notificationsReplies.url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success) {
        setNotifications(data.data || []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(SummaryApi.notificationsRepliesMarkRead.url, {
        method: "PATCH",
        credentials: "include",
      });
      // cập nhật trạng thái đọc trong local state để badge biến mất
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  const handleClickNotification = async (n) => {
    try {
      await markAllAsRead();
      if (onClearBadge) onClearBadge(); // tắt badge ngay
      onClose(); // đóng dropdown

      if (n.productId) {
        navigate(`/product/${n.productId}`);
      } else if (n.chatId) {
        navigate(`/chat/${n.chatId}`);
      } else {
        console.warn("Notification không có đường dẫn:", n);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý click notification:", error);
    }
  };

  const handleClose = async () => {
    await markAllAsRead();
    if (onClearBadge) onClearBadge();
    onClose();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="absolute top-12 right-0 w-80 bg-white shadow-lg rounded-lg border p-3 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Thông báo</h3>
        <button
          onClick={handleClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Đóng
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">Không có thông báo</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                !n.isRead ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => handleClickNotification(n)}
            >
              <p className="text-sm">
                <span className="font-medium">{n.senderName}</span> đã trả lời
                bạn
              </p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;
