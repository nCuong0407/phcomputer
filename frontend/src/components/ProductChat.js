import React, { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";
import Context from "../context";
import SummaryApi from "../common";

const ITEMS_PER_PAGE = 5;

const ProductChat = ({ productId }) => {
  const { user } = useContext(Context);
  const [messages, setMessages] = useState([]); // flat list
  const [threadedMessages, setThreadedMessages] = useState([]); // nested
  const [loading, setLoading] = useState(false);
  const [replyInputs, setReplyInputs] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [lastAction, setLastAction] = useState(null); // 'new' or 'reply' or null
  const [page, setPage] = useState(1);
  const prevMessagesLengthRef = useRef(0);

  // Build nested from flat list, sort by createdAt DESC (mới nhất đầu)
  const buildThreadedMessages = (msgs) => {
    const map = {};
    const roots = [];
    msgs.forEach((msg) => {
      map[msg._id] = { ...msg, replies: [] };
    });
    msgs.forEach((msg) => {
      const parentId = msg.replyTo?._id;
      if (parentId && map[parentId]) {
        map[parentId].replies.push(map[msg._id]);
      } else {
        roots.push(map[msg._id]);
      }
    });
    const sortByDateDesc = (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt);
    const sortRecursive = (node) => {
      node.replies.sort(sortByDateDesc);
      node.replies.forEach(sortRecursive);
    };
    roots.sort(sortByDateDesc);
    roots.forEach(sortRecursive);
    return roots;
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${SummaryApi.getMessages.url}/${productId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data?.success) {
        setMessages(data.data || []);
      } else {
        setMessages([]);
        toast.error(data?.message || "Không thể tải tin nhắn");
      }
    } catch (err) {
      console.error("Lỗi khi tải tin nhắn:", err);
      toast.error("Không thể tải tin nhắn");
    }
  };

  const sendMessage = async (message, replyTo = null) => {
    if (!message?.trim()) return;
    setLastAction(replyTo ? "reply" : "new");
    setLoading(true);
    try {
      const body = { message };
      if (replyTo) body.replyTo = replyTo;
      const res = await fetch(`${SummaryApi.sendMessage.url}/${productId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.success) {
        setPage(1); // reset về trang 1 hiển thị tin nhắn mới nhất
        await fetchMessages();
      } else {
        toast.error(data?.message || "Gửi tin nhắn thất bại");
        setLastAction(null);
      }
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
      toast.error("Có lỗi xảy ra");
      setLastAction(null);
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (messageId) => {
    const replyContent = replyInputs[messageId];
    if (!replyContent?.trim()) return;
    await sendMessage(replyContent, messageId);
    setReplyInputs((prev) => ({ ...prev, [messageId]: "" }));
    setReplyingTo(null);
  };

  useEffect(() => {
    setThreadedMessages(buildThreadedMessages(messages));
  }, [messages]);

  // Bỏ phần scroll tự động khi reply (comment lại)
  /*
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      if (lastAction !== "reply") {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      setLastAction(null);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, lastAction]);
  */

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [productId]);

  // Phân trang
  const totalPages = Math.ceil(threadedMessages.length / ITEMS_PER_PAGE);
  const currentPageMessages = threadedMessages.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const goPrevPage = () => setPage((p) => (p > 1 ? p - 1 : p));
  const goNextPage = () => setPage((p) => (p < totalPages ? p + 1 : p));

  return (
    <div className="flex flex-col h-[450px] bg-white border rounded-lg shadow-md p-4">
      {/* Danh sách threaded (phân trang) */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-2">
        {currentPageMessages.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            Chưa có câu hỏi nào.
          </p>
        ) : (
          currentPageMessages.map((msg) => (
            <MessageItem
              key={msg._id}
              msg={msg}
              user={user}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyInputs={replyInputs}
              setReplyInputs={setReplyInputs}
              sendReply={sendReply}
              loading={loading}
              level={0} // Bắt đầu từ level 0 cho root
            />
          ))
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mb-2 text-sm text-gray-600">
          <button
            onClick={goPrevPage}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            &lt; Trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={goNextPage}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            Sau &gt;
          </button>
        </div>
      )}

      {/* Gửi câu hỏi mới */}
      {user ? (
        <NewQuestionInput
          onSend={(text) => sendMessage(text)}
          loading={loading}
        />
      ) : (
        <div className="text-center text-gray-500 italic">
          Hãy đăng nhập để đặt câu hỏi
        </div>
      )}
    </div>
  );
};

const MessageItem = ({
  msg,
  user,
  replyingTo,
  setReplyingTo,
  replyInputs,
  setReplyInputs,
  sendReply,
  loading,
  level,
}) => {
  return (
    <div
      className={`border rounded-lg p-3 shadow-sm ${
        level === 0 ? "bg-gray-50" : "bg-white"
      }`}
      style={{ marginLeft: `${level * 16}px` }} // Thụt lề theo level
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-orange-600">
          {msg.userId?.name || "Ẩn danh"}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(msg.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="mb-2 text-gray-800">{msg.message}</div>

      {msg.replies?.length > 0 && (
        <div className="space-y-2 mb-2">
          {msg.replies.map((reply) => (
            <MessageItem
              key={reply._id}
              msg={reply}
              user={user}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyInputs={replyInputs}
              setReplyInputs={setReplyInputs}
              sendReply={sendReply}
              loading={loading}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {user && (
        <button
          className="text-sm text-orange-600 hover:underline"
          onClick={() => setReplyingTo(msg._id === replyingTo ? null : msg._id)}
        >
          {msg._id === replyingTo ? "Hủy trả lời" : "Trả lời"}
        </button>
      )}

      {msg._id === replyingTo && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Nhập câu trả lời..."
            className="flex-1 border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={replyInputs[msg._id] || ""}
            onChange={(e) =>
              setReplyInputs((prev) => ({
                ...prev,
                [msg._id]: e.target.value,
              }))
            }
            onKeyDown={(e) => e.key === "Enter" && sendReply(msg._id)}
          />
          <button
            onClick={() => sendReply(msg._id)}
            disabled={loading || !replyInputs[msg._id]?.trim()}
            className="bg-orange-500 text-white px-4 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Gửi
          </button>
        </div>
      )}
    </div>
  );
};

const NewQuestionInput = ({ onSend, loading }) => {
  const [text, setText] = useState("");
  const handleSend = () => {
    onSend(text);
    setText("");
  };
  return (
    <div className="flex gap-2">
      <input
        type="text"
        className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Nhập câu hỏi của bạn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={loading}
      />
      <button
        className="bg-orange-500 text-white px-5 rounded hover:bg-orange-600 disabled:opacity-50"
        onClick={handleSend}
        disabled={loading || !text.trim()}
      >
        Gửi
      </button>
    </div>
  );
};

export default ProductChat;
