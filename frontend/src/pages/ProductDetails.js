"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";
import CategroyWiseProductDisplay from "../components/CategroyWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import RatingSummary from "../components/ProductRating";
import ProductChat from "../components/ProductChat";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    CPU: "",
    Memory: "",
    SSD: "",
    VGA: "",
    Display: "",
    Touch: "",
    Wireless: "",
    LAN: "",
    Battery: "",
    OS: "",
    Weight: "",
    Color: "",
    Warranty: "",
    Option: "",
    TinhTrang: "",
  });

  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);
  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: params?.id,
        }),
      });
      const dataResponse = await response.json();
      setData(dataResponse?.data || {});
      setActiveImage(dataResponse?.data?.productImage?.[0] || "");
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      setData({});
      setActiveImage("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomImageCoordinate({
      x,
      y,
    });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="min-h-[300px]">
        {/* Phần trên: Ảnh bên trái, Thông tin sản phẩm bên phải */}
        <div className="flex flex-col lg:flex-row gap-0">
          <div
            className="w-full lg:flex-shrink-0 lg:flex justify-center"
            style={{ flexBasis: "40%" }}
          >
            {/* Ảnh thumbnail */}
            <div className="w-full lg:w-[100px] lg:mx-auto lg:mr-4">
              {loading ? (
                <div className="flex gap-4 lg:flex-col overflow-auto lg:mx-auto">
                  {productImageListLoading.map((_, index) => (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                      key={"loadingImage" + index}
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 lg:flex-col overflow-auto lg:mx-auto">
                  {data?.productImage?.map((imgURL) => (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded p-2"
                      key={imgURL}
                    >
                      <img
                        src={imgURL || "/placeholder.svg"}
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                        onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                        onClick={() => handleMouseEnterProduct(imgURL)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ảnh lớn */}
            <div className="h-[400px] w-full lg:w-[400px] bg-transparent p-0 flex justify-center">
              <div className="h-[400px] w-[400px] bg-slate-200 relative">
                <img
                  src={activeImage || "/placeholder.svg"}
                  className="h-full w-full object-scale-down mix-blend-multiply"
                  onMouseMove={handleZoomImage}
                  onMouseLeave={handleLeaveImageZoom}
                />
                {zoomImage && (
                  <div className="hidden lg:block absolute min-w-[600px] overflow-hidden min-h-[500px] bg-slate-200 p-4 -right-[610px] top-0">
                    <div
                      className="w-full h-full min-h-[500px] min-w-[600px] mix-blend-multiply scale-150"
                      style={{
                        background: `url(${activeImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                          zoomImageCoordinate.y * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm bên phải */}
          <div className="w-full lg:flex-grow" style={{ flexBasis: "60%" }}>
            <div className="flex-1 bg-white border rounded-lg p-6 mb-6">
              {loading ? (
                <div>
                  <p className="bg-slate-200 animate-pulse h-8 w-full rounded-full inline-block"></p>
                  <h2 className="text-3xl lg:text-4xl font-semibold h-10 bg-slate-200 animate-pulse w-full"></h2>
                  <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-8 w-full"></p>
                  <div className="text-red-600 bg-slate-200 h-8 animate-pulse flex items-center gap-1 w-full"></div>
                  <div className="flex items-center gap-4 text-2xl lg:text-3xl font-medium my-2 h-10 bg-slate-200 animate-pulse w-full">
                    <p className="text-red-600 bg-slate-200 w-full"></p>
                    <p className="text-slate-400 line-through bg-slate-200 w-full"></p>
                  </div>
                  <div className="flex items-center gap-4 my-4 w-full">
                    <button className="h-12 bg-slate-200 rounded animate-pulse w-full"></button>
                    <button className="h-12 bg-slate-200 rounded animate-pulse w-full"></button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
                    {data?.productName}
                  </h2>
                  <p className="bg-red-200 text-red-600 px-3 py-1 rounded-full inline-block w-fit mb-2">
                    {data?.brandName}
                  </p>
                  <p className="capitalize text-slate-400 text-xl mb-2">
                    {data?.category}
                  </p>
                  <div className="text-red-600 flex items-center gap-2 mb-2 text-xl">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalf />
                  </div>
                  <div className="flex items-center gap-4 text-2xl lg:text-3xl font-medium my-2 mb-2">
                    <p className="text-red-600">
                      {displayINRCurrency(data.sellingPrice)}
                    </p>
                    <p className="text-slate-400 line-through">
                      {displayINRCurrency(data.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 my-4">
                    <button
                      className="border-2 border-red-600 rounded-lg px-4 py-2 min-w-[140px] text-xl text-red-600 font-medium hover:bg-red-600 hover:text-white"
                      onClick={(e) => handleBuyProduct(e, data?._id)}
                    >
                      Mua ngay
                    </button>
                    <button
                      className="border-2 border-red-600 rounded-lg px-4 py-2 min-w-[140px] font-medium text-white text-xl bg-red-600 hover:text-red-600 hover:bg-white"
                      onClick={(e) => handleAddToCart(e, data?._id)}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phần dưới: Thông tin sản phẩm và cấu hình */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="w-full lg:flex-shrink-0" style={{ flexBasis: "60%" }}>
            {loading ? (
              <div className="w-full">
                <div className="bg-white border rounded-lg p-6">
                  <p className="text-slate-600 font-medium my-2 h-8 bg-slate-200 rounded animate-pulse w-full"></p>
                  <p className="bg-slate-200 rounded animate-pulse h-12 w-full"></p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-green-700 font-bold text-2xl mb-4 border-b pb-2">
                    Thông tin sản phẩm
                  </h3>
                  <p className="text-lg text-justify">{data?.description}</p>
                </div>
              </div>
            )}
          </div>

          <div
            className="w-full lg:flex-grow"
            style={{ flexBasis: "40%", padding: "0" }}
          >
            {loading ? (
              <div className="w-full">
                <div className="bg-white border rounded-lg p-6 h-full">
                  {productImageListLoading.map((_, index) => (
                    <p
                      key={index}
                      className="bg-slate-200 animate-pulse h-8 w-full"
                    ></p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-white border rounded-lg p-6 h-full">
                  <h3 className="text-green-700 font-bold text-2xl mb-4 border-b pb-2">
                    Cấu hình sản phẩm
                  </h3>
                  <table className="w-full border-collapse">
                    <tbody>
                      {[
                        "CPU",
                        "Memory",
                        "SSD",
                        "VGA",
                        "Display",
                        "Touch",
                        "Wireless",
                        "LAN",
                        "Battery",
                        "OS",
                        "Weight",
                        "Color",
                        "Warranty",
                        "Option",
                        "TinhTrang",
                      ].map((item, index) => (
                        <tr
                          key={item}
                          className={index % 2 === 0 ? "bg-gray-100" : ""}
                        >
                          <td className="font-medium text-lg p-0.5">{item}:</td>
                          <td className="text-lg p-0.5">
                            {data[item] || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chỉ render khi đã có productId */}
      {data._id && (
        <>
          <div className="mt-8">
            <RatingSummary
              productId={data._id}
              ratingStats={data.ratingStats}
            />
          </div>

          <div className="mt-8">
            <ProductChat productId={data._id} />
          </div>
        </>
      )}

      {data.category && (
        <CategroyWiseProductDisplay
          category={data.category}
          heading="SẢN PHẨM TƯƠNG TỰ"
          headingClass="text-green-700"
        />
      )}
    </div>
  );
};

export default ProductDetails;
