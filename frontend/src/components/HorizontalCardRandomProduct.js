import React, { useContext, useEffect, useState } from "react";
import fetchCategoryWiseProductRandom from "../helpers/fetchCategoryWiseProductRandom";
import displayINRCurrency from "../helpers/displayCurrency";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const HorizontalCardRandomProduct = ({ heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  const loadingList = new Array(5).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const products = await fetchCategoryWiseProductRandom();
    setData(products);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="container mx-auto px-4 my-6">
      <h2 className="text-2xl font-semibold py-4 text-orange-600">{heading}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {(loading ? loadingList : data.slice(0, visibleCount))?.map(
          (product, index) => {
            return loading ? (
              <div
                key={index}
                className="bg-white p-4 rounded-md shadow animate-pulse"
              >
                <div className="h-32 bg-slate-200 mb-4"></div>
                <div className="h-4 bg-slate-200 mb-2 rounded"></div>
                <div className="h-4 bg-slate-200 w-2/3 mb-2 rounded"></div>
                <div className="h-4 bg-slate-200 w-1/2 mb-2 rounded"></div>
                <div className="h-8 bg-slate-200 rounded mt-4"></div>
              </div>
            ) : (
              <Link
                to={`product/${product._id}`}
                key={index}
                className="bg-white p-3 rounded-md shadow hover:shadow-md transition duration-300 flex flex-col h-full"
              >
                <div className="h-40 flex justify-center items-center mb-2">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="max-h-full object-contain"
                  />
                </div>

                <h3 className="font-medium text-sm mb-1 break-words leading-5 min-h-[3rem]">
                  {product.productName}
                </h3>

                <p className="text-slate-500 text-xs mb-1 capitalize min-h-[1.25rem]">
                  {product.category}
                </p>

                <div className="flex justify-between items-center mb-1">
                  <p className="text-gray-400 line-through text-base font-medium">
                    {displayINRCurrency(product.price)}
                  </p>
                  <p className="text-red-600 font-semibold text-lg">
                    {displayINRCurrency(product.sellingPrice)}
                  </p>
                </div>

                {product.price > product.sellingPrice && (
                  <p className="text-green-600 text-sm font-semibold mb-2 text-right">
                    Giảm{" "}
                    {Math.round(
                      ((product.price - product.sellingPrice) / product.price) *
                        100
                    )}
                    %
                  </p>
                )}

                <button
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-full mt-auto"
                  onClick={(e) => handleAddToCart(e, product._id)}
                >
                  Thêm vào giỏ hàng
                </button>
              </Link>
            );
          }
        )}
      </div>

      {!loading && visibleCount < data.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleShowMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default HorizontalCardRandomProduct;
