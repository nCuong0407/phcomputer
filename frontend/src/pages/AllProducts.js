"use client";

import React, { useEffect, useState } from "react";
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
  MdModeEdit,
  MdDelete,
  MdAdd,
  MdRefresh,
  MdViewModule,
  MdViewList,
} from "react-icons/md";
import {
  FaBox,
  FaImage,
  FaTag,
  FaDollarSign,
  FaEye,
  FaShoppingCart,
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { toast } from "react-toastify";
import moment from "moment";
import "moment/locale/vi";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";
import AdminEditProduct from "../components/AdminEditProduct";

moment.locale("vi");

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("grid");
  const [editProduct, setEditProduct] = useState(null);

  const fetchAllProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(SummaryApi.allProduct.url);
      const dataResponse = await response.json();
      console.log("product data", dataResponse);
      setAllProduct(dataResponse?.data || []);
    } catch (err) {
      setError("Lỗi khi tải danh sách sản phẩm");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    console.log("=== DELETE PRODUCT DEBUG ===");
    console.log("Product ID:", productId);
    console.log("Product Name:", productName);
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)
    ) {
      try {
        const response = await fetch(
          `${SummaryApi.deleteProduct?.url}/${productId}`,
          {
            method: SummaryApi.deleteProduct?.method || "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const dataResponse = await response.json();
          console.log("Response data:", dataResponse);
          if (dataResponse.success) {
            toast.success(dataResponse.message || "Xóa sản phẩm thành công!");
            fetchAllProduct();
          } else {
            toast.error(dataResponse.message || "Lỗi khi xóa sản phẩm");
          }
        } else {
          toast.error("Server trả về response không đúng format");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        if (error.message.includes("Failed to fetch")) {
          toast.error("Không thể kết nối tới server. Kiểm tra kết nối mạng.");
        } else if (error.message.includes("404")) {
          toast.error("API endpoint không tồn tại. Kiểm tra route backend.");
        } else if (error.message.includes("500")) {
          toast.error("Lỗi server nội bộ. Kiểm tra console backend.");
        } else {
          toast.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
        }
      }
    }
  };

  const handleEditProduct = (product) => {
    console.log("Edit product:", product);
    setEditProduct(product);
    setOpenUploadProduct(true);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const filteredProducts = allProduct.filter((product) =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number.parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-red-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">
              Đang tải sản phẩm...
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <FaBox className="text-orange-500 animate-bounce" />
              <p className="text-gray-600 font-medium">
                Vui lòng chờ trong giây lát
              </p>
              <FaShoppingCart className="text-red-500 animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiLightningBolt className="text-white text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Oops! Có lỗi xảy ra
          </h3>
          <p className="text-red-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={fetchAllProduct}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="bg-white shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Quản lý sản phẩm
                </h1>
                <p className="text-gray-600 font-medium">
                  Quản lý kho hàng và danh mục sản phẩm
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setOpenUploadProduct(true); // mở khung
                setEditProduct(null); // ✅ đảm bảo là KHÔNG sửa sản phẩm nào cả
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <MdAdd className="text-xl" />
              <span>Thêm sản phẩm</span>
              <HiSparkles className="text-lg animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 font-medium"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                >
                  <MdViewModule className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                >
                  <MdViewList className="text-lg" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  Hiển thị:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors duration-200"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
              <button
                onClick={fetchAllProduct}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <MdRefresh className="text-lg" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Hiển thị{" "}
                <span className="font-bold text-orange-600">
                  {startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-orange-600">
                  {Math.min(endIndex, filteredProducts.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-bold text-orange-600">
                  {filteredProducts.length}
                </span>{" "}
                sản phẩm
                {searchTerm && (
                  <span className="ml-2 text-blue-600">
                    (đã lọc từ {allProduct.length} sản phẩm)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-xl border border-orange-100">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <FaBox className="text-orange-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm
                    ? `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}"`
                    : "Chưa có sản phẩm nào"}
                </h3>
                <p className="text-gray-500">
                  Hãy thêm sản phẩm đầu tiên của bạn
                </p>
              </div>
            ) : (
              currentProducts.map((product, index) => (
                <div
                  key={product._id || index}
                  className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
                    <img
                      src={
                        product.productImage?.[0] ||
                        "/placeholder.svg?height=200&width=300&query=product"
                      }
                      alt={product.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=300";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        #{startIndex + index + 1}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200">
                        <FaEye className="text-orange-500 text-sm" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                        {product?.productName || "N/A"}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                          {product?.category || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product?.createdAt
                            ? moment(product.createdAt).format("DD/MM/YYYY")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-2xl font-black text-green-600">
                        {product?.sellingPrice
                          ? `${product.sellingPrice.toLocaleString()} đ`
                          : "Chưa có giá"}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-1"
                      >
                        <MdModeEdit className="text-sm" />
                        <span className="text-sm">Sửa</span>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProduct(product._id, product.productName)
                        }
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-1"
                      >
                        <MdDelete className="text-sm" />
                        <span className="text-sm">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                    <th className="px-6 py-4 text-left font-bold">#</th>
                    <th className="px-6 py-4 text-left font-bold">Hình ảnh</th>
                    <th className="px-6 py-4 text-left font-bold">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-center font-bold">Giá bán</th>
                    <th className="px-6 py-4 text-center font-bold">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                            <FaBox className="text-orange-400 text-2xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">
                              {searchTerm
                                ? `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}"`
                                : "Chưa có sản phẩm nào"}
                            </h3>
                            <p className="text-gray-500">
                              Danh sách sản phẩm sẽ hiển thị tại đây
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product, index) => (
                      <tr
                        key={product._id || index}
                        className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {startIndex + index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-orange-200">
                            <img
                              src={
                                product.productImage?.[0] ||
                                "/placeholder.svg?height=64&width=64&query=product"
                              }
                              alt={product.productName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src =
                                  "/placeholder.svg?height=64&width=64";
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-lg">
                            {product?.productName || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span class="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                            {product?.category || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-xl font-black text-green-600 whitespace-nowrap">
                            {product?.sellingPrice
                              ? `${product.sellingPrice.toLocaleString()} đ`
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {product?.createdAt
                              ? moment(product.createdAt).format("DD/MM/YYYY")
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center space-x-2">
                            <button
                              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl group-hover:animate-pulse"
                              onClick={() => handleEditProduct(product)}
                              aria-label={`Chỉnh sửa sản phẩm ${product?.productName}`}
                            >
                              <MdModeEdit className="text-lg" />
                            </button>
                            <button
                              className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl group-hover:animate-pulse"
                              onClick={() =>
                                handleDeleteProduct(
                                  product._id,
                                  product.productName
                                )
                              }
                              aria-label={`Xóa sản phẩm ${product?.productName}`}
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
        )}

        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="text-sm text-gray-600 font-medium">
                Trang{" "}
                <span className="font-bold text-orange-600">{currentPage}</span>{" "}
                /{" "}
                <span className="font-bold text-orange-600">{totalPages}</span>
              </div>
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110"
                  }`}
                  title="Trang đầu"
                >
                  <MdFirstPage size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110"
                  }`}
                >
                  <MdChevronLeft size={20} />
                </button>
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
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-110"
                        : pageNumber === "..."
                        ? "bg-transparent text-gray-400 cursor-default"
                        : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white hover:shadow-lg hover:transform hover:scale-110"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110"
                  }`}
                >
                  <MdChevronRight size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110"
                  }`}
                  title="Trang cuối"
                >
                  <MdLastPage size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {openUploadProduct && editProduct ? (
        <AdminEditProduct
          productData={editProduct}
          onClose={() => {
            setOpenUploadProduct(false);
            setEditProduct(null);
          }}
          fetchData={fetchAllProduct}
        />
      ) : (
        openUploadProduct && (
          <UploadProduct
            onClose={() => setOpenUploadProduct(false)}
            fetchData={fetchAllProduct}
          />
        )
      )}
    </div>
  );
};

export default AllProducts;
