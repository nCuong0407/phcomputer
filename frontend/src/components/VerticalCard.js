import React, { useContext, useState } from "react";
import scrollTop from "../helpers/scrollTop";
import displayINRCurrency from "../helpers/displayCurrency";
import Context from "../context";
import addToCart from "../helpers/addToCart";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

const VerticalCard = ({ loading, data = [] }) => {
  const { fetchUserAddToCart } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const loadingList = new Array(ITEMS_PER_PAGE).fill(null);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
    scrollTop();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="border rounded-md shadow-sm bg-white p-4 animate-pulse"
              >
                <div className="bg-gray-200 h-40 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))
          : currentData.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                onClick={scrollTop}
                className="border rounded-md shadow-sm bg-white hover:shadow-md transition p-4 flex flex-col"
              >
                <div className="h-40 flex justify-center items-center overflow-hidden mb-4">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="object-contain max-h-full"
                    onError={(e) =>
                      (e.target.src = "/placeholder.svg?height=200&width=200")
                    }
                  />
                </div>
                <h2 className="font-semibold text-base line-clamp-2 mb-1 text-gray-800">
                  {product.productName}
                </h2>
                <p className="text-sm text-gray-500 mb-1 capitalize">
                  Thương hiệu: {product.brand || product.category}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600 font-semibold text-lg">
                    {displayINRCurrency(product.sellingPrice)}
                  </span>
                  <span className="line-through text-gray-500 text-sm">
                    {displayINRCurrency(product.price)}
                  </span>
                </div>
                <button
                  className="mt-auto bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-full"
                  onClick={(e) => handleAddToCart(e, product._id)}
                >
                  Thêm vào giỏ
                </button>
              </Link>
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p>
            Trang <span className="text-orange-600">{currentPage}</span> /{" "}
            {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              className="w-9 h-9 rounded-full bg-gray-200 disabled:opacity-50"
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
            >
              {"|<"}
            </button>
            <button
              className="w-9 h-9 rounded-full bg-gray-200 disabled:opacity-50"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-full ${
                  currentPage === i + 1
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => changePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="w-9 h-9 rounded-full bg-gray-200 disabled:opacity-50"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
            <button
              className="w-9 h-9 rounded-full bg-gray-200 disabled:opacity-50"
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {">|"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalCard;
