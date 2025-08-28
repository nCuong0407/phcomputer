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
    CPU: productData?.CPU || "",
    Memory: productData?.Memory || "",
    SSD: productData?.SSD || "",
    VGA: productData?.VGA || "",
    Display: productData?.Display || "",
    Touch: productData?.Touch || "",
    Wireless: productData?.Wireless || "",
    LAN: productData?.LAN || "",
    Battery: productData?.Battery || "",
    OS: productData?.OS || "",
    Weight: productData?.Weight || "",
    Color: productData?.Color || "",
    Warranty: productData?.Warranty || "",
    Option: productData?.Option || "",
    TinhTrang: productData?.TinhTrang || "",
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

          {/* Cấu hình cơ bản */}
          <label htmlFor="CPU" className="mt-3">
            CPU:
          </label>
          <input
            type="text"
            id="CPU"
            name="CPU"
            value={data.CPU}
            onChange={handleOnChange}
            placeholder="Nhập thông tin CPU"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Memory" className="mt-3">
            Memory:
          </label>
          <input
            type="text"
            id="Memory"
            name="Memory"
            value={data.Memory}
            onChange={handleOnChange}
            placeholder="Nhập thông tin Memory (RAM)"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="SSD" className="mt-3">
            SSD:
          </label>
          <input
            type="text"
            id="SSD"
            name="SSD"
            value={data.SSD}
            onChange={handleOnChange}
            placeholder="Nhập thông tin SSD capacity"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="VGA" className="mt-3">
            VGA:
          </label>
          <input
            type="text"
            id="VGA"
            name="VGA"
            value={data.VGA}
            onChange={handleOnChange}
            placeholder="Nhập thông tin VGA"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Display" className="mt-3">
            Display:
          </label>
          <input
            type="text"
            id="Display"
            name="Display"
            value={data.Display}
            onChange={handleOnChange}
            placeholder="Nhập thông tin Display"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Touch" className="mt-3">
            Touch:
          </label>
          <input
            type="text"
            id="Touch"
            name="Touch"
            value={data.Touch}
            onChange={handleOnChange}
            placeholder="Nhập Touch (Yes/No)"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Wireless" className="mt-3">
            Wireless:
          </label>
          <input
            type="text"
            id="Wireless"
            name="Wireless"
            value={data.Wireless}
            onChange={handleOnChange}
            placeholder="Nhập thông tin Wireless"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="LAN" className="mt-3">
            LAN:
          </label>
          <input
            type="text"
            id="LAN"
            name="LAN"
            value={data.LAN}
            onChange={handleOnChange}
            placeholder="Nhập thông tin LAN"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Battery" className="mt-3">
            Battery:
          </label>
          <input
            type="text"
            id="Battery"
            name="Battery"
            value={data.Battery}
            onChange={handleOnChange}
            placeholder="Nhập thông tin Battery"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="OS" className="mt-3">
            OS:
          </label>
          <input
            type="text"
            id="OS"
            name="OS"
            value={data.OS}
            onChange={handleOnChange}
            placeholder="Nhập thông tin Operating System"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Weight" className="mt-3">
            Weight:
          </label>
          <input
            type="text"
            id="Weight"
            name="Weight"
            value={data.Weight}
            onChange={handleOnChange}
            placeholder="Nhập thông cân nặng (kg)"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Color" className="mt-3">
            Color:
          </label>
          <input
            type="text"
            id="Color"
            name="Color"
            value={data.Color}
            onChange={handleOnChange}
            placeholder="Nhập màu"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Warranty" className="mt-3">
            Warranty:
          </label>
          <input
            type="text"
            id="Warranty"
            name="Warranty"
            value={data.Warranty}
            onChange={handleOnChange}
            placeholder="Nhập thời gian bảo hành"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="Option" className="mt-3">
            Option:
          </label>
          <input
            type="text"
            id="Option"
            name="Option"
            value={data.Option}
            onChange={handleOnChange}
            placeholder="Nhập Option"
            className="p-2 bg-slate-100 border rounded"
          />

          <label htmlFor="TinhTrang" className="mt-3">
            Tình trạng:
          </label>
          <input
            type="text"
            id="TinhTrang"
            name="TinhTrang"
            value={data.TinhTrang}
            onChange={handleOnChange}
            placeholder="Nhập Tình trạng (New/Used)"
            className="p-2 bg-slate-100 border rounded"
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
