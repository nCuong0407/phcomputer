"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GrSearch } from "react-icons/gr";
import { BsGrid3X3Gap, BsList } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import SummaryApi from "../common";

const SearchPage = () => {
  console.log("SearchPage component is rendering!"); // Thêm log này để kiểm tra
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "relevance",
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const productsPerPage = 12;

  useEffect(() => {
    if (query) {
      fetchSearchResults();
      fetchCategories();
      fetchBrands();
    }
  }, [query, currentPage, filters]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        page: currentPage,
        limit: productsPerPage,
        ...filters,
      });

      console.log("Fetching search results with params:", params.toString());

      const response = await fetch(`${SummaryApi.searchProduct.url}?${params}`);
      const data = await response.json();

      console.log("Search results:", data);

      if (data.success) {
        setProducts(data.data || []);
        setTotalProducts(data.total || 0);
      } else {
        console.error("Search failed:", data.message);
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getCategoryProduct.url);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Categories error:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(SummaryApi.allProduct.url);
      const data = await response.json();
      if (data.success && data.data) {
        const uniqueBrands = [
          ...new Set(
            data.data.map((product) => String(product.brandName || ""))
          ),
        ].filter(Boolean);
        setBrands(uniqueBrands.sort());
      }
    } catch (error) {
      console.error("Brands error:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);

    // Update URL
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "relevance",
    });
    navigate(`/search?q=${query}`, { replace: true });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const highlightSearchTerm = (text, searchTerm) => {
    // Đảm bảo text là một chuỗi trước khi xử lý hoặc trả về
    const safeText = typeof text === "string" ? text : String(text || "");
    if (!searchTerm || !safeText) return safeText;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = safeText.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* NEW: Container for Search Header and View Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
          {/* Search Header (left) */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Kết quả tìm kiếm cho: "{query}"
            </h1>
            <p className="text-gray-600">
              Tìm thấy {totalProducts} sản phẩm
              {filters.category &&
                ` trong danh mục "${String(filters.category)}"`}
              {filters.brand && ` của thương hiệu "${String(filters.brand)}"`}
            </p>
          </div>

          {/* View Controls and Pagination (right) */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <BsGrid3X3Gap size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <BsList size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 whitespace-nowrap">
              Trang {currentPage} / {totalPages || 1}
            </p>
          </div>
        </div>

        {/* Existing: Filters Sidebar and Products Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <FiFilter className="mr-2" />
                  Bộ lọc
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-blue-600"
                >
                  {showFilters ? "Ẩn" : "Hiện"}
                </button>
              </div>

              <div
                className={`space-y-4 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thương hiệu ({brands.length})
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) =>
                      handleFilterChange("brand", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map((brand, index) => (
                      <option key={index} value={String(brand)}>
                        {String(brand)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục ({categories.length})
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={String(cat)}>
                        {String(cat)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Từ (VNĐ)"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Đến (VNĐ)"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="relevance">Liên quan nhất</option>
                    <option value="price_asc">Giá thấp đến cao</option>
                    <option value="price_desc">Giá cao đến thấp</option>
                    <option value="name_asc">Tên A-Z</option>
                    <option value="name_desc">Tên Z-A</option>
                    <option value="brand_asc">Thương hiệu A-Z</option>
                    <option value="brand_desc">Thương hiệu Z-A</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
              </div>
            )}

            {/* Products */}
            {!loading && products.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
                      viewMode === "list" ? "flex p-4" : "p-4"
                    }`}
                  >
                    <img
                      src={
                        product.productImage?.[0] ||
                        "/placeholder.svg?height=200&width=200&query=laptop"
                      }
                      alt={String(product.productName || "Product Image")}
                      className={
                        viewMode === "list"
                          ? "w-24 h-24 object-cover rounded-lg mr-4"
                          : "w-full h-48 object-cover rounded-lg mb-4"
                      }
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=200";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {highlightSearchTerm(
                          String(product.productName || ""),
                          query
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.brandName &&
                          highlightSearchTerm(
                            String(product.brandName || ""),
                            query
                          )}{" "}
                        • {String(product.category || "")}
                      </p>
                      {/* Hiển thị thông số kỹ thuật nếu có */}
                      {(product.CPU || product.Memory || product.SSD) && (
                        <p className="text-xs text-gray-500 mb-2">
                          {product.CPU && `${String(product.CPU)} • `}
                          {product.Memory && `${String(product.Memory)} • `}
                          {product.SSD && String(product.SSD)}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-red-600">
                            {formatPrice(product.sellingPrice)}
                          </p>
                          {product.price > product.sellingPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                        {product.relevanceScore &&
                          product.relevanceScore > 50 && (
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Khớp cao
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <GrSearch size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Không có sản phẩm nào khớp với "{query}"
                  {filters.brand &&
                    ` của thương hiệu "${String(filters.brand)}"`}
                  {filters.category &&
                    ` trong danh mục "${String(filters.category)}"`}
                </p>
                <div className="space-x-2">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Xóa bộ lọc
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Trước
                    </button>
                  )}

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }).slice(Math.max(0, currentPage - 3), currentPage + 2)}

                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Sau
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
