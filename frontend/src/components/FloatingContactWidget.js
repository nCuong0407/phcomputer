import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaPhone,
  FaFacebookMessenger,
  FaRegCommentDots,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import SummaryApi from "../common";
import Context from "../context";
import { Link, useLocation } from "react-router-dom";
import displayVNDCurrency from "../helpers/displayCurrency";

// --- CÁC COMPONENT CON (Giữ nguyên) ---
const TextMessage = ({ message }) => {
  const alignment = message.sender === "user" ? "justify-end" : "justify-start";
  const bgColor = {
    user: "bg-blue-500 text-white",
    bot: "bg-gray-200 text-gray-800",
    staff: "bg-green-500 text-white",
    server: "bg-yellow-200 text-yellow-800 italic text-sm",
  }[message.sender];
  return (
    <div className={`flex ${alignment} animate-[fadeIn_0.3s_ease-out]`}>
      <div className={`px-4 py-2 rounded-2xl max-w-xs ${bgColor}`}>
        {message.text}
      </div>
    </div>
  );
};

const ProductListMessage = ({ message }) => (
  <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
    <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 w-full">
      <p className="mb-2 font-medium">{message.message}</p>
      <div className="space-y-2">
        {message.data.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="flex gap-2 items-center p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-bold text-sm line-clamp-1">{product.name}</p>
              <p className="text-red-600 text-sm font-semibold">
                {displayVNDCurrency(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const SuggestionMessage = ({ message, onRequestSupport }) => (
  <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
    <div className="p-3 rounded-2xl bg-gray-200 text-gray-800">
      <p>{message.message}</p>
      <button
        onClick={onRequestSupport}
        className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
      >
        Nói chuyện với nhân viên
      </button>
    </div>
  </div>
);

const QuickReplyMessage = ({ message, onQuickReply }) => (
  <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
    <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 w-full">
      <p className="mb-2">{message.message}</p>
      <div className="flex flex-wrap gap-2">
        {message.options.map((option) => (
          <button
            key={option}
            onClick={() => onQuickReply(option)}
            className="px-3 py-1 bg-white border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// --- COMPONENT CHÍNH ---
const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLiveChatActive, setIsLiveChatActive] = useState(false);
  const [activeStaff, setActiveStaff] = useState(null);

  const { user, socket } = useContext(Context); // LẤY SOCKET TỪ CONTEXT
  const chatEndRef = useRef(null);
  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const productId = pathParts[1] === "product" ? pathParts[2] : null;

  // LẮNG NGHE SỰ KIỆN TRÊN SOCKET CHUNG
  useEffect(() => {
    if (socket && isChatOpen) {
      socket.on("server_message", (text) =>
        setMessages((prev) => [...prev, { sender: "server", text }])
      );
      socket.on("chat_started", (data) => {
        setMessages((prev) => [
          ...prev,
          { sender: "server", text: data.message },
        ]);
        setActiveStaff(data.staff);
      });
      socket.on("new_message", (data) => {
        if (data.sender === user?.name) return;
        setMessages((prev) => [
          ...prev,
          { sender: "staff", text: data.message },
        ]);
      });
    }
    return () => {
      // Dọn dẹp listener khi component unmount hoặc khi chat đóng
      if (socket) {
        socket.off("server_message");
        socket.off("chat_started");
        socket.off("new_message");
      }
    };
  }, [socket, isChatOpen, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsChatOpen(false);
      setIsLiveChatActive(false);
      setActiveStaff(null);
    }
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;
    const userMessage = { sender: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);

    if (isLiveChatActive) {
      if (!socket) return;
      const room = `support_room_${socket.id}`;
      socket.emit("chat_message", {
        room,
        sender: user?.name,
        message: messageText,
        customerId: socket.id,
      });
    } else {
      try {
        const response = await fetch(SummaryApi.chatbot.url, {
          method: SummaryApi.chatbot.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageText, productId }),
        });
        const botData = await response.json();
        setMessages((prev) => [...prev, { sender: "bot", ...botData }]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { sender: "server", text: "Bot đang quá tải, thử lại sau." },
        ]);
      }
    }
    setInputMessage("");
  };

  const handleQuickReply = (text) => handleSendMessage(text);

  const handleContactClick = (option) => {
    if (option.type === "external") {
      window.open(option.link, "_blank");
    } else if (option.type === "internal") {
      setIsChatOpen(true);
      handleSendMessage("xin chào");
    }
  };

  const handleRequestSupport = () => {
    if (!socket) return;
    setIsLiveChatActive(true);
    setMessages((prev) => [
      ...prev,
      { sender: "server", text: "Đang kết nối tới nhân viên hỗ trợ..." },
    ]);
    socket.emit("user_request_support", { name: user?.name || "Khách" });
  };

  const contactOptions = [
    {
      name: "Zalo",
      icon: <SiZalo className="text-white text-xl" />,
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      link: "https://zalo.me/0932502254",
      type: "external",
    },
    {
      name: "Facebook",
      icon: <FaFacebookMessenger className="text-white text-xl" />,
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      link: "https://www.facebook.com/tinhocphanhuyen?locale=vi_VN",
      type: "external",
    },
    {
      name: "Chat với chúng tôi",
      icon: <FaRegCommentDots className="text-white text-xl" />,
      bgColor: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      type: "internal",
    },
    {
      name: "Gọi điện",
      icon: <FaPhone className="text-white text-xl" />,
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      link: "tel:0932502254",
      type: "external",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[9999] md:bottom-6 md:right-6 lg:bottom-20 lg:right-8">
      {/* Nội dung widget (xuất hiện phía trên nút contact khi mở) */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-gray-200 w-[350px] transition-all duration-300 ease-in-out transform origin-bottom-right animate-[slideUp_0.3s_ease-out] z-10 ${
            isChatOpen ? "h-[500px] flex flex-col" : ""
          }`}
        >
          <div className="flex-shrink-0 flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-2xl">
            {isChatOpen && activeStaff ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeStaff.profilePic}
                    alt={activeStaff.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
                <div>
                  <h3 className="text-md font-bold leading-tight">
                    {activeStaff.name}
                  </h3>
                  <p className="text-xs text-blue-200 leading-tight">
                    Đang hoạt động
                  </p>
                </div>
              </div>
            ) : (
              <h3 className="text-lg font-bold">
                {isChatOpen ? "Hỗ trợ trực tuyến" : "Liên hệ với chúng tôi"}
              </h3>
            )}
            <button
              onClick={toggleWidget}
              className="hover:bg-blue-700 p-2 rounded-full"
            >
              <FaTimes />
            </button>
          </div>
          {isChatOpen ? (
            <>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => {
                  if (msg.type === "quick_reply")
                    return (
                      <QuickReplyMessage
                        key={index}
                        message={msg}
                        onQuickReply={handleQuickReply}
                      />
                    );
                  if (msg.type === "product_list")
                    return <ProductListMessage key={index} message={msg} />;
                  if (msg.type === "suggestion")
                    return (
                      <SuggestionMessage
                        key={index}
                        message={msg}
                        onRequestSupport={handleRequestSupport}
                      />
                    );
                  return <TextMessage key={index} message={msg} />;
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="flex-shrink-0">
                <div className="p-3 border-t flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={!user}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!user}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md disabled:bg-gray-400"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
                {!user && (
                  <p className="text-center text-xs text-red-500 p-2 bg-red-50">
                    Vui lòng đăng nhập để chat
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="p-4 space-y-3">
                {contactOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleContactClick(option)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl ${option.bgColor} ${option.hoverColor} text-white font-bold transition-transform transform hover:scale-105`}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      {option.icon}
                    </div>
                    <span className="text-left flex-1">{option.name}</span>
                  </button>
                ))}
              </div>
              {/* Footer khi chưa bật chat */}
              <div className="mt-4 pt-3 border-t border-gray-100 p-4">
                <p className="text-xs text-gray-500 text-center">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                </p>
              </div>
            </>
          )}
        </div>
      )}
      {/* Nút contact (FaComments) giữ nguyên vị trí, luôn hiển thị phía trên */}
      <div className="relative flex justify-end">
        <button
          onClick={toggleWidget}
          className={`w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-20 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <FaComments className="text-white text-2xl" />
        </button>
        {!isOpen && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full animate-ping opacity-20 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default FloatingContactWidget;
