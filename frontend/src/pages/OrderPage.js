import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";

const ITEMS_PER_PAGE = 10;

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method,
        credentials: "include",
      });

      const responseData = await response.json();
      console.log("Fetched data:", responseData);
      setData(responseData.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      {data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Không có đơn hàng nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedData.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Ngày đặt hàng: {moment(item.createdAt).format("LL")}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Mã đơn hàng: {item._id}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sản phẩm */}
                  <div className="lg:col-span-2">
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                      Sản phẩm
                    </h3>
                    {item?.productDetails?.length > 0 ? (
                      item.productDetails.map((product, index) => (
                        <div
                          key={product.productId + index}
                          className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mb-3"
                        >
                          <img
                            src={
                              product.image?.[0] ||
                              "https://via.placeholder.com/112"
                            }
                            className="w-24 h-24 object-contain rounded-md bg-white p-2"
                            alt={product.name || "Sản phẩm"}
                          />
                          <div className="flex-1">
                            <h4 className="text-base font-medium text-gray-800 line-clamp-1">
                              {product.name || "Không rõ tên sản phẩm"}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-md font-semibold text-red-600">
                                {displayINRCurrency(product.price || 0)}
                              </span>
                              <span className="text-sm text-gray-600">
                                Số lượng: {product.quantity || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">
                        Không có sản phẩm trong đơn hàng
                      </p>
                    )}
                  </div>

                  {/* Thanh toán & vận chuyển */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-gray-700 mb-3">
                        Chi tiết thanh toán
                      </h3>
                      <p className="text-sm text-gray-600">
                        Phương thức thanh toán:{" "}
                        {item.paymentDetails?.payment_method_type?.[0] ||
                          "Không xác định"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Trạng thái thanh toán:{" "}
                        {item.paymentDetails?.status || "Không xác định"}
                      </p>

                      <h3 className="text-md font-medium text-gray-700 mt-4 mb-3">
                        Chi tiết vận chuyển
                      </h3>
                      <p className="text-sm text-gray-600">
                        Trạng thái vận chuyển:{" "}
                        {item.shippingStatus || "Không xác định"}
                      </p>
                      {item?.shipping_options?.length > 0 ? (
                        item.shipping_options.map((shipping, index) => (
                          <p
                            key={shipping.shipping_rate || index}
                            className="text-sm text-gray-600"
                          >
                            Phí vận chuyển:{" "}
                            {displayINRCurrency(
                              shipping.shipping_amount || 20000
                            )}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">
                          Phí vận chuyển: {displayINRCurrency(20000)}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        Tổng số tiền:{" "}
                        {displayINRCurrency(item.totalAmount || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PHÂN TRANG */}
          <div className="flex justify-center items-center mt-10 gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
