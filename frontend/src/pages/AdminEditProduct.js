import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminEditProduct = ({ onClose, productData, fetchData }) => {
  const [data, setData] = useState({
    ...productData,
    _id: productData?._id || "",
    productName: productData?.productName || "",
    brandName: productData?.brandName || "",
    category: productData?.category || "",
    productImage: productData?.productImage || [],
    description: productData?.description || "",
    price: productData?.price || 0,
    sellingPrice: productData?.sellingPrice || 0,
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);

    if (uploadImageCloudinary?.url) {
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadImageCloudinary.url],
      }));
    } else {
      toast.error("Tải ảnh lên thất bại");
    }
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: newProductImage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message || "Cập nhật sản phẩm thành công");
      onClose();
      if (typeof fetchData === "function") {
        fetchData(); // Chỉ gọi nếu fetchData là hàm
      } else {
        console.warn("fetchData không phải là hàm");
      }
    } else {
      toast.error(responseData.message || "Cập nhật sản phẩm thất bại");
    }
  };

  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Chỉnh sửa sản phẩm</h2>
          <div
            className="text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className="grid p-4 gap-2 overflow-y-scroll h-full pb-5"
          onSubmit={handleSubmit}
        >
          {/* Input tên sản phẩm */}
          <label htmlFor="productName">Tên sản phẩm:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName" className="mt-3">
            Nhà sản xuất:
          </label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category" className="mt-3">
            Kiểu loại:
          </label>
          <select
            required
            name="category"
            value={data.category}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value="">Chọn kiểu loại</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={index}>
                {el.label}
              </option>
            ))}
          </select>

          {/* Upload hình ảnh */}
          <label className="mt-3">Hình ảnh sản phẩm:</label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex flex-col items-center gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Tải hình ảnh sản phẩm</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>

          <div className="flex items-center gap-2 flex-wrap">
            {data.productImage.length > 0 ? (
              data.productImage.map((el, index) => (
                <div className="relative group" key={index}>
                  <img
                    src={el}
                    alt="product"
                    width={80}
                    height={80}
                    className="bg-slate-100 border cursor-pointer"
                    onClick={() => {
                      setOpenFullScreenImage(true);
                      setFullScreenImage(el);
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                    onClick={() => handleDeleteProductImage(index)}
                  >
                    <MdDelete />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-red-600 text-xs">*Hãy tải hình ảnh lên</p>
            )}
          </div>

          {/* Giá */}
          <label htmlFor="price" className="mt-3">
            Nhập giá niêm yết:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={data.price}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="sellingPrice" className="mt-3">
            Nhập giá giảm giá:
          </label>
          <input
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            value={data.sellingPrice}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="description" className="mt-3">
            Thêm thông tin sản phẩm:
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleOnChange}
            className="h-28 bg-slate-100 border resize-none p-2"
            placeholder="Nhập thông tin sản phẩm"
          />

          <button className="px-3 py-2 bg-blue-600 text-white mb-10 hover:bg-blue-700">
            Cập nhật sản phẩm
          </button>
        </form>
      </div>

      {/* Hiển thị ảnh toàn màn hình */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default AdminEditProduct;
