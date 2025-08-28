// frontend/src/components/CashPaymentForm.jsx
import { useState } from "react";
import axios from "axios";

const CashPaymentForm = ({ cartItems }) => {
  const [message, setMessage] = useState("");

  const handleCashPayment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/orders/create",
        { cartItems },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(res.data.message || "Đặt hàng thành công");
    } catch (err) {
      setMessage(err.response?.data?.message || "Đặt hàng thất bại");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-4">Thanh toán khi nhận hàng</h2>
      <p className="mb-2">
        Phí vận chuyển: <strong>30.000đ</strong>
      </p>
      <button
        onClick={handleCashPayment}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        Xác nhận đặt hàng
      </button>
      {message && <p className="mt-3 text-blue-600">{message}</p>}
    </div>
  );
};

export default CashPaymentForm;
