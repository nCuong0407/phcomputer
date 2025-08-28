import React, { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";

const AdminProductCard = ({ data, fetchData }) => {
  const [editProduct, setEditProduct] = useState(false);

  return (
    <div className="bg-white p-4 rounded">
      <img
        src={data?.productImage[0]}
        className="w-full h-[180px] object-contain"
        alt={data?.productName}
      />
      <h1 className="text-center font-medium mt-2">{data.productName}</h1>

      {/* Mô tả sản phẩm */}
      <p className="text-sm text-black mt-1 break-words">{data.description}</p>

      <div
        className="w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
        onClick={() => setEditProduct(true)}
      >
        <MdModeEditOutline />
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
