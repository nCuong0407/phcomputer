import React, { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";
import Context from "../context";
import SummaryApi from "../common";

const ProductChat = ({ productId }) => {
  const { user } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Lấy danh sách tin nhắn
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${SummaryApi.getMessages.url}/${productId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data?.data) {
        setMessages(data.data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải tin nhắn:", err);
      toast.error("Không thể tải tin nhắn");
    }
  };

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${SummaryApi.sendMessage.url}/${productId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      const data = await res.json();
      if (data?.success) {
        setNewMessage("");
        await fetchMessages();
      } else {
        toast.error(data?.message || "Gửi tin nhắn thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll xuống cuối khi có tin mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    // Có thể setInterval để auto refresh tin nhắn
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="flex flex-col h-[400px] bg-white border rounded-lg shadow-md">
      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Chưa có tin nhắn nào.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.userId?._id === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${
                  msg.userId?._id === user?._id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="text-xs font-semibold mb-1">
                  {msg.userId?.name || "Ẩn danh"}
                </div>
                <div>{msg.message}</div>
                <div className="text-[10px] mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ô nhập tin nhắn */}
      {user ? (
        <div className="flex border-t p-3 gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 disabled:opacity-50"
          >
            Gửi
          </button>
        </div>
      ) : (
        <div className="p-3 border-t text-center text-gray-500 text-sm italic">
          Hãy đăng nhập để chat
        </div>
      )}
    </div>
  );
};

export default ProductChat;
