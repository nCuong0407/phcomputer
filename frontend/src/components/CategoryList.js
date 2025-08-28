import React from "react";
import { Link } from "react-router-dom";
import productCategory from "../helpers/productCategory";

const CategoryList = () => {
  return (
    <div className="w-full mt-2 mb-4">
      <div
        className="flex items-center justify-start gap-4 w-full bg-[#3f82f9] text-white py-2 px-6 overflow-x-auto scrollbar-none fixed top-16 z-30"
        style={{ minHeight: "40px" }}
      >
        {productCategory.map((product, index) => {
          const queryParams = new URLSearchParams();
          queryParams.set("category", product.value); // Truyền category value qua query

          return (
            <Link
              to={`/product-category?${queryParams.toString()}`}
              key={`${product.category}-${product.brand || "all"}`}
              className="flex items-center gap-1 hover:bg-blue-700 px-3 py-1 rounded transition duration-300 whitespace-nowrap"
            >
              <span className="text-sm font-medium uppercase">
                {product.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
