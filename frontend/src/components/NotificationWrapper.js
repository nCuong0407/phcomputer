import React, { useState, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import NotificationDropdown from "./NotificationDropdown";
import SummaryApi from "../common";

const NotificationWrapper = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Lấy số lượng thông báo chưa đọc
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(SummaryApi.notificationsReplies.url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success) {
        setUnreadCount(data.data?.length || 0);
      }
    } catch (err) {
      console.error("Lỗi khi lấy số lượng thông báo:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const handleClearBadge = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <div
        className="text-2xl cursor-pointer relative"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <IoNotificationsOutline />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <NotificationDropdown
          onClose={() => setShowDropdown(false)}
          onClearBadge={handleClearBadge}
        />
      )}
    </div>
  );
};

export default NotificationWrapper;
