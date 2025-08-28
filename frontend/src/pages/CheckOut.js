import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { user, fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "", // Thêm trường Ghi chú
  });

  if (!state) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center">
        <p>Dữ liệu giỏ hàng không khả dụng. Vui lòng quay lại giỏ hàng!</p>
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const cartItems = state.cartItems || [];
  const shippingFee = 20000;
  const productTotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (acc, item) => acc + item.quantity * item.productId.sellingPrice,
        0
      )
    : 0;
  const totalAmount = productTotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!/^\d+$/.test(formData.phone)) {
      toast.warning("Số điện thoại phải là số!");
      return;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    try {
      const products = cartItems.map((item) => ({
        productId: item.productId._id,
        name: item.productId.productName,
        price: item.productId.sellingPrice,
        quantity: item.quantity,
        image: item.productId.productImage, // là mảng
      }));

      const payload = {
        userId: user._id,
        products, // đã đầy đủ name, price, quantity, image...
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        totalAmount,
        shippingFee,
        paymentMethod: "cod",
      };

      console.log("Payload gửi đi:", payload);

      const res = await fetch(`${SummaryApi.payment.url}`, {
        method: SummaryApi.payment.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Lỗi server: ${errorData.message || res.statusText}`);
      }

      const data = await res.json();
      console.log("Phản hồi từ payment API:", data);

      if (data.success) {
        toast.success("Đặt hàng thành công!");

        // Xóa toàn bộ giỏ hàng
        const deletePromises = cartItems.map((item) =>
          fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: item._id }),
          })
        );

        const deleteResponses = await Promise.all(deletePromises);
        const deleteResults = await Promise.all(
          deleteResponses.map((res) => res.json())
        );

        const allDeleted = deleteResults.every((result) => result.success);
        if (allDeleted) {
          await fetchUserAddToCart();
          setTimeout(() => {
            navigate("/success");
          }, 1500);
        } else {
          toast.error("Xóa giỏ hàng thất bại. Vui lòng thử lại!");
          console.log("Kết quả xóa giỏ hàng:", deleteResults);
        }
      } else {
        toast.error(
          `Thanh toán thất bại: ${data.message || "Lỗi không xác định"}`
        );
      }
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      toast.error(`Có lỗi xảy ra: ${err.message}`);
    }
  };

  const handleCancel = () => {
    // Điều hướng đến trang Cancel
    navigate("/cancel");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Xác nhận thanh toán</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Hiển thị danh sách sản phẩm */}
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between mb-4 border-b pb-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.productId?.productImage[0]}
                alt={item.productId?.productName}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.productId?.productName}</p>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity}
                </p>
                <p className="text-sm text-red-600">
                  {displayINRCurrency(item.productId?.sellingPrice)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Thông tin giao hàng */}
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Họ tên"
            required
            className="w-full border p-2 rounded"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            required
            className="w-full border p-2 rounded"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <textarea
            placeholder="Địa chỉ giao hàng"
            required
            className="w-full border p-2 rounded"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <textarea
            placeholder="Ghi chú"
            className="w-full border p-2 rounded"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        {/* Tổng cộng */}
        <div className="mt-6 border-t pt-4">
          <p>Tổng tiền sản phẩm: {displayINRCurrency(productTotal)}</p>
          <p>Phí ship: {displayINRCurrency(shippingFee)}</p>
          <p className="font-bold text-lg mt-2">
            Tổng cộng: {displayINRCurrency(totalAmount)}
          </p>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mt-4">
          <p className="font-semibold">Phương thức thanh toán</p>
          <p className="text-gray-600">
            Thanh toán bằng tiền mặt khi nhận hàng
          </p>
        </div>

        {/* Nút xác nhận và huỷ thanh toán */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white py-3 rounded-lg mt-6 text-lg font-semibold hover:bg-red-700 transition"
        >
          Xác nhận thanh toán
        </button>
        <button
          type="button" // Thay type="submit" bằng type="button"
          onClick={handleCancel}
          className="w-full bg-gray-400 text-white py-3 rounded-lg mt-4 text-lg font-semibold hover:bg-gray-500 transition"
        >
          Huỷ thanh toán
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
