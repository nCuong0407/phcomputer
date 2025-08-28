import React, { useState, useEffect, useRef, useContext } from "react";
import Context from "../../context";
import { FaUserClock, FaRocketchat } from "react-icons/fa";

const LiveChatDashboard = () => {
  const [waitingCustomers, setWaitingCustomers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const { user, socket } = useContext(Context);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (socket && user?.role === "ADMIN") {
      const handleWaitingListUpdate = (waitingList) => {
        setWaitingCustomers(waitingList || []);
      };
      const handleNewMessage = (data) => {
        if (activeChat && activeChat.room.endsWith(data.customerId)) {
          setActiveChat((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                sender: data.sender === user.name ? "staff" : "user",
                text: data.message,
              },
            ],
          }));
        }
      };
      const handleChatStarted = (data) => {
        if (activeChat) {
          setActiveChat((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              { sender: "server", text: data.message },
            ],
          }));
        }
      };

      socket.on("update_waiting_list", handleWaitingListUpdate);
      socket.on("new_message", handleNewMessage);
      socket.on("chat_started", handleChatStarted);
      socket.emit("staff_join", user);

      return () => {
        socket.off("update_waiting_list", handleWaitingListUpdate);
        socket.off("new_message", handleNewMessage);
        socket.off("chat_started", handleChatStarted);
      };
    }
  }, [socket, user, activeChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleAcceptChat = (customer) => {
    if (!socket) return;
    const room = `support_room_${customer.socketId}`;
    setActiveChat({ room, customerName: customer.name, messages: [] });
    socket.emit("staff_accept_chat", { room, customerId: customer.socketId });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChat || !socket) return;
    const messagePayload = {
      room: activeChat.room,
      sender: user.name,
      message: inputMessage,
    };
    socket.emit("chat_message", messagePayload);
    setActiveChat((prev) => ({
      ...prev,
      messages: [...prev.messages, { sender: "staff", text: inputMessage }],
    }));
    setInputMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header của trang */}
        <div className="bg-white shadow-lg border-b border-gray-200 rounded-2xl mb-6">
          <div className="px-6 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaRocketchat className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quản lý tin nhắn
                </h1>
                <p className="text-gray-600 font-medium">
                  Hỗ trợ và tương tác với khách hàng trực tuyến
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Khung chat chính */}
        <div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <div className="flex h-full">
            {/* Cột khách chờ */}
            <div className="w-1/4 bg-gray-50 border-r p-4 overflow-y-auto flex flex-col">
              <h2 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2 flex-shrink-0">
                Khách đang chờ ({waitingCustomers.length})
              </h2>
              <div className="space-y-2 flex-1">
                {waitingCustomers.length > 0 ? (
                  waitingCustomers.map((customer) => (
                    <div
                      key={customer.socketId}
                      className="p-3 bg-blue-100 rounded-lg shadow-sm flex justify-between items-center transition hover:shadow-md hover:bg-blue-200"
                    >
                      <span className="font-medium text-gray-800">
                        {customer.name}
                      </span>
                      <button
                        onClick={() => handleAcceptChat(customer)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-bold"
                      >
                        Chat
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 pt-10">
                    <FaUserClock className="mx-auto text-4xl mb-2" />
                    <p>Chưa có khách nào.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Khung chat chính */}
            <div className="w-3/4 flex flex-col bg-white">
              {activeChat ? (
                <>
                  <div className="p-4 border-b bg-gray-50 shadow-sm flex-shrink-0">
                    <h3 className="font-bold text-gray-800">
                      Đang chat với:{" "}
                      <span className="text-blue-600">
                        {activeChat.customerName}
                      </span>
                    </h3>
                  </div>
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-100">
                    {activeChat.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.sender === "staff"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl max-w-lg shadow ${
                            msg.sender === "staff"
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-800"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t bg-white flex-shrink-0 flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-md font-bold"
                    >
                      Gửi
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center text-gray-400">
                  <div>
                    <FaUserClock className="mx-auto text-5xl mb-2" />
                    <p>Chọn một khách hàng để bắt đầu chat.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChatDashboard;
