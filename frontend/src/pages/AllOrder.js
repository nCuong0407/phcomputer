"use client";

import { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 10;

const AllOrder = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentStatuses, setPaymentStatuses] = useState({}); // State để lưu trạng thái thanh toán
  const [shippingStatuses, setShippingStatuses] = useState({}); // State để lưu trạng thái vận chuyển
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.allOrder.url, {
        method: SummaryApi.allOrder.method,
        credentials: "include",
      });

      const responseData = await response.json();
      setData(responseData.data || []);

      // Khởi tạo trạng thái ban đầu từ dữ liệu API
      const initialPaymentStatuses = {};
      const initialShippingStatuses = {};
      responseData.data.forEach((item) => {
        initialPaymentStatuses[item._id] = item.paymentDetails?.status || "";
        initialShippingStatuses[item._id] = item.shippingStatus || "";
      });
      setPaymentStatuses(initialPaymentStatuses);
      setShippingStatuses(initialShippingStatuses);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      const response = await fetch(`${SummaryApi.updateOrder.url}/${orderId}`, {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const responseData = await response.json();
      console.log("Phản hồi từ API:", responseData); // Debug chi tiết
      if (responseData.success) {
        const newPaymentStatus =
          updates.paymentDetails?.status || paymentStatuses[orderId];
        const newShippingStatus =
          updates.shippingStatus || shippingStatuses[orderId];

        setPaymentStatuses((prev) => ({
          ...prev,
          [orderId]: newPaymentStatus,
        }));
        setShippingStatuses((prev) => ({
          ...prev,
          [orderId]: newShippingStatus,
        }));

        toast.success(responseData.message || "Cập nhật đơn hàng thành công");

        // Bạn có thể giữ fetch lại nếu muốn đồng bộ:
        setTimeout(() => {
          fetchOrderDetails();
        }, 1000);
      } else {
        toast.error(responseData.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Lỗi khi cập nhật đơn hàng");
    }
  };

  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item._id?.toLowerCase().includes(searchLower) ||
      item.productDetails?.some(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.productName?.toLowerCase().includes(searchLower)
      )
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                  Quản lý đơn hàng
                </h1>
                <p className="text-gray-600 font-medium">
                  Quản lý và theo dõi tất cả đơn hàng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng theo mã hoặc sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
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
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <button
                onClick={fetchOrderDetails}
                className="bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Làm mới</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-medium text-orange-600">
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredData.length
              )}
            </span>{" "}
            -{" "}
            <span className="font-medium text-orange-600">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-orange-600">
              {filteredData.length}
            </span>{" "}
            đơn hàng
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-600">
              Chưa có đơn hàng nào được tạo hoặc không tìm thấy kết quả phù hợp.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedData.map((item, index) => (
                <div
                  key={item._id || item.userId + index}
                  className="bg-white shadow-sm hover:shadow-lg rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-orange-200"
                >
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 border-b border-gray-200 ">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
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
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Ngày đặt hàng:{" "}
                            {moment(item.createdAt).format("DD/MM/YYYY")}
                          </h2>
                          <p className="text-sm text-gray-600">
                            Mã đơn hàng:{" "}
                            <span className="font-mono font-medium">
                              {item._id || item.userId}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {displayINRCurrency(item.totalAmount || 0)}
                        </p>
                        <p className="text-sm text-gray-600">Tổng giá trị</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          Sản phẩm trong đơn hàng
                        </h3>
                        {item?.productDetails?.length > 0 ? (
                          <div className="space-y-4">
                            {item.productDetails.map((product, index) => (
                              <div
                                key={product.productId + index}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-all duration-200"
                              >
                                <div className="w-20 h-20 bg-white rounded-lg p-2 shadow-sm">
                                  <img
                                    src={
                                      product.image?.[0] ||
                                      product.imageUrl ||
                                      "/placeholder.svg?height=80&width=80&query=product" ||
                                      "/placeholder.svg"
                                    }
                                    className="w-full h-full object-contain"
                                    alt={product.name || "Sản phẩm"}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
                                    {product.name ||
                                      product.productName ||
                                      "Sản phẩm không xác định"}
                                  </h4>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-orange-600">
                                      {displayINRCurrency(product.price || 0)}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">
                                        Số lượng:
                                      </span>
                                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                                        {product.quantity || product.qty || 0}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <svg
                              className="w-12 h-12 mx-auto mb-3 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                            <p>Không có sản phẩm trong đơn hàng</p>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-1">
                        <div className="space-y-6">
                          {/* Payment Details */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <svg
                                className="w-5 h-5 mr-2 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                              Thanh toán
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Phương thức:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {item.paymentDetails
                                    ?.payment_method_type?.[0] ||
                                    item.paymentMethod ||
                                    "Không xác định"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Trạng thái:
                                </span>
                                <span
                                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                                    paymentStatuses[item._id] ===
                                    "Thanh toán thành công"
                                      ? "bg-green-100 text-green-800"
                                      : paymentStatuses[item._id] ===
                                        "Thanh toán thất bại"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {paymentStatuses[item._id] ||
                                    item.paymentDetails?.status ||
                                    "Không xác định"}
                                </span>
                              </div>
                              <div className="mt-4">
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                  Cập nhật trạng thái:
                                </label>
                                <select
                                  value={paymentStatuses[item._id] || ""}
                                  onChange={(e) =>
                                    handleUpdateOrder(item._id, {
                                      paymentDetails: {
                                        status: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                  <option value="">
                                    -- Chọn trạng thái --
                                  </option>
                                  <option value="Chờ thanh toán">
                                    Chờ thanh toán
                                  </option>
                                  <option value="Thanh toán thành công">
                                    Người dùng đã thanh toán
                                  </option>
                                  <option value="Thanh toán thất bại">
                                    Thanh toán thất bại
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Details */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <svg
                                className="w-5 h-5 mr-2 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                              </svg>
                              Vận chuyển
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Phí vận chuyển:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {item?.shipping_options?.length > 0
                                    ? displayINRCurrency(
                                        item.shipping_options[0]
                                          .shipping_amount || 20000
                                      )
                                    : displayINRCurrency(20000)}
                                </span>
                              </div>
                              {shippingStatuses[item._id] && (
                                <div className="bg-white p-3 rounded-lg border border-green-200">
                                  <p className="text-sm text-green-700 font-medium">
                                    {getShippingStatusText(
                                      shippingStatuses[item._id]
                                    )}
                                  </p>
                                </div>
                              )}
                              <div className="mt-4">
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                  Cập nhật vận chuyển:
                                </label>
                                <select
                                  value={shippingStatuses[item._id] || ""}
                                  onChange={(e) =>
                                    handleUpdateOrder(item._id, {
                                      shippingStatus: e.target.value,
                                    })
                                  }
                                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                >
                                  <option value="">
                                    -- Chọn trạng thái --
                                  </option>
                                  <option value="Đang chuẩn bị đơn hàng">
                                    Đang chuẩn bị đơn hàng
                                  </option>
                                  <option value="Đơn hàng đang vận chuyển">
                                    Đơn hàng đang vận chuyển
                                  </option>
                                  <option value="Giao hàng thành công">
                                    Giao hàng thành công
                                  </option>
                                  <option value="Giao hàng thất bại">
                                    Giao hàng thất bại
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center mt-12">
              <div className="flex items-center space-x-2 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Trước</span>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-orange-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span>Sau</span>
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

// Hàm ánh xạ trạng thái vận chuyển thành thông báo
const getShippingStatusText = (status) => {
  switch (status) {
    case "Chuẩn bị hàng":
      return "Đơn hàng đang được chuẩn bị.";
    case "Đang vận chuyển":
      return "Đơn hàng đang trên đường giao.";
    case "Giao hàng thành công":
      return "Đơn hàng đã giao thành công!";
    case "Giao hàng thất bại":
      return "Đơn hàng giao không thành công.";
    default:
      return "Trạng thái không xác định.";
  }
};

export default AllOrder;
