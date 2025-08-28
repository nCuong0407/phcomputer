import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify"; // ✅ thêm toast

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
    });

    const responseData = await response.json();
    if (responseData.success) {
      setData(responseData.data);
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().then(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ _id: id, quantity: qty + 1 }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
    } else {
    }
  };

  const decraseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id, quantity: qty - 1 }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
      } else {
      }
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } else {
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  const handleSelectAll = () => {
    const allSelected = !selectAll;
    setSelectAll(allSelected);
    setSelectedItems(allSelected ? data.map((item) => item._id) : []);
  };

  const handleItemSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    if (data.length === 0) {
      toast.warning("Không có sản phẩm nào để thanh toán");
      return;
    }

    const currentTotalQty = data.reduce((sum, item) => sum + item.quantity, 0);
    const currentTotalPrice = data.reduce(
      (sum, item) => sum + item.quantity * (item?.productId?.sellingPrice || 0),
      0
    );

    toast.success("Chuyển đến trang thanh toán");
    navigate("/checkout", {
      state: {
        cartItems: data,
        totalQty: currentTotalQty,
        totalPrice: currentTotalPrice,
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để xóa");
      return;
    }
    const confirmed = window.confirm("Bạn có muốn bỏ các sản phẩm đã chọn?");
    if (confirmed) {
      Promise.all(
        selectedItems.map((id) =>
          fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ _id: id }),
          })
        )
      ).then(async (responses) => {
        const results = await Promise.all(responses.map((res) => res.json()));
        const successCount = results.filter((r) => r.success).length;
        if (successCount > 0) {
          toast.success(`Đã xóa ${successCount} sản phẩm khỏi giỏ hàng`);
          fetchData();
          context.fetchUserAddToCart();
        } else {
          toast.error("Xóa sản phẩm thất bại");
        }
      });
    }
  };

  const totalQty = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = data.reduce(
    (sum, item) => sum + item.quantity * (item?.productId?.sellingPrice || 0),
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Giỏ Hàng</h2>

      {data.length === 0 && !loading && (
        <p className="bg-white py-5 text-center">
          Không có sản phẩm nào trong giỏ hàng
        </p>
      )}

      <div className="bg-white rounded shadow overflow-hidden mb-6">
        <div className="grid grid-cols-[40px_1fr_150px_150px_80px] items-center px-4 py-3 bg-gray-50 text-sm font-semibold border-b">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span>Sản phẩm</span>
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Thao tác</span>
        </div>
        {loading
          ? loadingCart.map((_, index) => (
              <div
                key={index}
                className="w-full h-24 border-b border-gray-200 animate-pulse"
              ></div>
            ))
          : data.map((product) => (
              <div
                key={product?._id}
                className="grid grid-cols-[40px_1fr_150px_150px_80px] items-center px-4 py-4 border-b hover:bg-gray-50 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product._id)}
                  onChange={() => handleItemSelect(product._id)}
                />
                <div className="flex items-center gap-4">
                  <img
                    src={product?.productId?.productImage[0]}
                    alt={product?.productId?.productName}
                    className="w-16 h-16 object-contain border p-1"
                  />
                  <div>
                    <p className="font-medium text-base line-clamp-1">
                      {product?.productId?.productName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {product?.productId?.category}
                    </p>
                  </div>
                </div>
                <div className="text-red-500 font-semibold">
                  {displayINRCurrency(product?.productId?.sellingPrice)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 border rounded text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => decraseQty(product?._id, product?.quantity)}
                  >
                    -
                  </button>
                  <span className="min-w-[20px] text-center">
                    {product?.quantity}
                  </span>
                  <button
                    className="w-7 h-7 border rounded text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => increaseQty(product?._id, product?.quantity)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteCartProduct(product?._id)}
                >
                  <MdDelete size={20} />
                </button>
              </div>
            ))}
      </div>

      <div className="bg-white p-4 shadow rounded flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span>Chọn Tất Cả ({data.length})</span>
          <button
            className="text-red-500 hover:underline"
            onClick={handleBulkDelete}
          >
            Xóa
          </button>
          <button className="text-blue-500 hover:underline">
            Lưu vào danh sách yêu thích
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm mt-4 sm:mt-0">
          <span>
            Tổng ({totalQty} sản phẩm):{" "}
            <span className="text-red-500 font-bold text-lg">
              {displayINRCurrency(totalPrice)}
            </span>
          </span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            onClick={handleCheckout}
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
