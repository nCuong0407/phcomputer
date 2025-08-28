import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProductRandom from "../helpers/fetchCategoryWiseProductRandom";
import displayINRCurrency from "../helpers/displayCurrency";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import scrollTop from "../helpers/scrollTop";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategoryWiseProductDisplay = ({ heading, headingClass = "" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const { fetchUserAddToCart } = useContext(Context);

  const visibleCount = 5;
  const totalProducts = 10;
  const itemWidth = 270;

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const randomProduct = await fetchCategoryWiseProductRandom();
    // Ensure we only take 10 products
    setData(randomProduct?.slice(0, totalProducts) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scroll = (direction) => {
    let newIndex;
    if (direction === "right") {
      newIndex = (startIndex + 1) % totalProducts;
    } else {
      newIndex = (startIndex - 1 + totalProducts) % totalProducts;
    }
    setStartIndex(newIndex);
  };

  // Get the 5 products to display based on startIndex
  const getVisibleProducts = () => {
    if (!data.length) return [];
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % totalProducts;
      result.push(data[index]);
    }
    return result;
  };

  return (
    <div className="relative container mx-auto px-4 my-6">
      <h2 className={`text-2xl font-semibold py-4 ${headingClass}`}>
        {heading}
      </h2>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-[45%] z-10 p-2 rounded-full bg-white hover:bg-gray-200 transition shadow-md group"
      >
        <FaChevronLeft className="text-xl group-hover:scale-110" />
        <div className="absolute left-full top-0 bottom-0 w-2 bg-gray-300 opacity-0 group-hover:opacity-50 transition" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-[45%] z-10 p-2 rounded-full bg-white hover:bg-gray-200 transition shadow-md group"
      >
        <FaChevronRight className="text-xl group-hover:scale-110" />
        <div className="absolute right-full top-0 bottom-0 w-2 bg-gray-300 opacity-0 group-hover:opacity-50 transition" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-hidden scroll-smooth scrollbar-none gap-4 pr-2 pl-8"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {(loading ? Array(visibleCount).fill(null) : getVisibleProducts()).map(
          (product, index) => (
            <div
              key={product?._id || index}
              className="min-w-[270px] max-w-[270px] bg-white rounded shadow shrink-0 scroll-snap-align-start"
            >
              <Link
                to={product?._id ? `/product/${product._id}` : "#"}
                onClick={scrollTop}
              >
                <div className="bg-slate-200 h-48 p-4 flex justify-center items-center">
                  {product?.productImage ? (
                    <img
                      src={product.productImage[0]}
                      className="object-contain h-full hover:scale-105 transition-all mix-blend-multiply"
                      alt={product.productName}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-300 animate-pulse" />
                  )}
                </div>
              </Link>
              <div className="p-4 grid gap-2">
                <h2 className="font-medium text-sm line-clamp-1">
                  {product?.productName || (
                    <div className="w-full h-4 bg-slate-200 animate-pulse rounded" />
                  )}
                </h2>
                <p className="capitalize text-slate-500 text-sm">
                  {product?.category || (
                    <div className="w-1/2 h-4 bg-slate-200 animate-pulse rounded" />
                  )}
                </p>
                <div className="flex gap-2">
                  <p className="text-red-600 font-semibold text-sm">
                    {product?.sellingPrice ? (
                      displayINRCurrency(product.sellingPrice)
                    ) : (
                      <div className="w-full h-4 bg-slate-200 animate-pulse rounded" />
                    )}
                  </p>
                  <p className="text-slate-500 line-through text-sm">
                    {product?.price ? (
                      displayINRCurrency(product.price)
                    ) : (
                      <div className="w-full h-4 bg-slate-200 animate-pulse rounded" />
                    )}
                  </p>
                </div>
                {product?._id ? (
                  <button
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full"
                    onClick={(e) => handleAddToCart(e, product._id)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                ) : (
                  <div className="w-full h-8 bg-slate-200 animate-pulse rounded" />
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
