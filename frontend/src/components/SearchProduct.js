"use client";

import { useState, useEffect, useRef } from "react";
import { GrSearch } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";

const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches và popular searches từ API thực
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing recent searches:", error);
        setRecentSearches([]);
      }
    }

    // Lấy popular searches từ API thực
    fetchPopularSearches();
  }, []);

  const fetchPopularSearches = async () => {
    try {
      // Lấy tất cả sản phẩm để tạo gợi ý tìm kiếm
      const response = await fetch(SummaryApi.allProduct.url);
      const data = await response.json();

      if (data.success && data.data) {
        const products = data.data;
        const suggestions = new Set();

        // Thêm tên thương hiệu
        products.forEach((product) => {
          if (product.brandName) {
            suggestions.add(product.brandName);
            suggestions.add(`Laptop ${product.brandName}`);
          }
          if (product.category) {
            suggestions.add(product.category);
          }
          // Thêm một số từ khóa phổ biến từ tên sản phẩm
          if (product.productName) {
            const words = product.productName.split(" ");
            words.forEach((word) => {
              if (word.length > 3) {
                suggestions.add(word);
              }
            });
          }
        });

        // Chuyển Set thành Array và lấy 20 gợi ý đầu tiên
        setPopularSearches(Array.from(suggestions).slice(0, 20));
      }
    } catch (error) {
      console.error("Error fetching popular searches:", error);
      // Fallback với gợi ý cố định
      setPopularSearches([
        "Laptop Dell",
        "Laptop HP",
        "Laptop Asus",
        "Laptop Lenovo",
        "Laptop Acer",
        "Laptop Gaming",
        "MacBook",
        "ThinkPad",
      ]);
    }
  };

  // Handle click outside để đóng results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function - chỉ tự động search khi nhập > 2 ký tự
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        performSearch(searchTerm, false); // false = không hiện dropdown tự động
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Hàm tìm kiếm chính - cải thiện để tìm tất cả sản phẩm cùng tên
  const performSearch = async (query, showDropdown = true) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Tìm kiếm với limit cao hơn để lấy nhiều kết quả hơn
      const response = await fetch(
        `${SummaryApi.searchProduct.url}?q=${encodeURIComponent(
          query
        )}&limit=50&sort=relevance`
      );
      const data = await response.json();

      console.log("Search response:", data); // Debug log

      if (data.success) {
        const results = data.data || [];
        setSearchResults(results);

        // Chỉ hiện dropdown khi được yêu cầu (focus input)
        if (showDropdown) {
          setShowResults(true);
        }
      } else {
        console.error("Search failed:", data.message);
        setSearchResults([]);
        if (showDropdown) {
          setShowResults(true);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      if (showDropdown) {
        setShowResults(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý submit form (Enter)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      executeSearch(searchTerm.trim());
    }
  };

  // Xử lý click vào nút search (kính lúp) - CHỈNH SỬA CHÍNH
  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Chuyển thẳng đến trang search results
      executeSearch(searchTerm.trim());
    }
  };

  const executeSearch = (term) => {
    // Lưu vào recent searches
    const newRecentSearches = [
      term,
      ...recentSearches.filter((item) => item !== term),
    ].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    // Navigate đến trang search results
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setShowResults(false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
    setShowResults(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    executeSearch(suggestion); // Chuyển thẳng đến trang search thay vì hiện dropdown
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    executeSearch(term); // Chuyển thẳng đến trang search thay vì hiện dropdown
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Xử lý focus input - CHỈ HIỆN DROPDOWN KHI FOCUS
  const handleInputFocus = () => {
    if (searchTerm.trim().length > 0) {
      if (searchResults.length > 0) {
        setShowResults(true);
      } else {
        performSearch(searchTerm.trim(), true);
      }
    } else if (recentSearches.length > 0 || popularSearches.length > 0) {
      setShowResults(true);
    }
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

  // Lọc gợi ý dựa trên input hiện tại
  const filteredSuggestions = popularSearches
    .filter((suggestion) =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="border border-black flex items-center w-full justify-between border rounded-full focus-within:shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Tìm theo tên, thương hiệu, loại laptop..."
            className="w-full bg-slate-200 outline-none pl-2 border rounded-l-full h-8 text-sm"
          />

          {/* {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 z-10"
            >
              <IoMdClose size={16} />
            </button>
          )} */}

          <button
            type="button"
            onClick={handleSearchButtonClick}
            disabled={isLoading}
            className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <GrSearch />
            )}
          </button>
        </div>
      </form>

      {/* Search Results Dropdown - CHỈ HIỆN KHI FOCUS INPUT */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Search Suggestions */}
          {searchTerm.length > 0 &&
            filteredSuggestions.length > 0 &&
            searchResults.length === 0 && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Gợi ý tìm kiếm
                </h4>
                <div className="space-y-1">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <GrSearch className="inline mr-2" size={12} />
                      {highlightSearchTerm(suggestion, searchTerm)}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Recent Searches */}
          {searchTerm.length === 0 && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Tìm kiếm gần đây
              </h4>
              <div className="space-y-1">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(term)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <GrSearch className="inline mr-2" size={12} />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {searchTerm.length === 0 &&
            recentSearches.length === 0 &&
            popularSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Tìm kiếm phổ biến
                </h4>
                <div className="space-y-1">
                  {popularSearches.slice(0, 6).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(term)}
                      className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <GrSearch className="inline mr-2" size={12} />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Search Results - CHỈ HIỆN KHI FOCUS INPUT */}
          {searchResults.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 mb-2">
                <h4 className="text-sm font-medium text-gray-600">
                  Kết quả tìm kiếm ({searchResults.length})
                </h4>
                <button
                  onClick={() => executeSearch(searchTerm)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Xem tất cả
                </button>
              </div>

              {searchResults.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                >
                  <img
                    src={
                      product.productImage?.[0] ||
                      "https://via.placeholder.com/50"
                    }
                    alt={product.productName}
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">
                      {highlightSearchTerm(product.productName, searchTerm)}
                    </h5>
                    <p className="text-xs text-gray-500 truncate">
                      {product.brandName &&
                        highlightSearchTerm(product.brandName, searchTerm)}{" "}
                      • {product.category}
                    </p>
                    <p className="text-sm font-semibold text-red-600">
                      {formatPrice(product.sellingPrice)}
                    </p>
                  </div>
                  {product.relevanceScore && product.relevanceScore > 15 && (
                    <div className="text-xs text-green-600 ml-2">🎯</div>
                  )}
                </div>
              ))}

              {searchResults.length > 8 && (
                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={() => executeSearch(searchTerm)}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2"
                  >
                    Xem tất cả {searchResults.length} kết quả
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {searchTerm.length > 1 &&
            searchResults.length === 0 &&
            !isLoading && (
              <div className="p-4 text-center text-gray-500">
                <GrSearch size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Không tìm thấy sản phẩm nào cho "{searchTerm}"
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Đang tìm kiếm...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
