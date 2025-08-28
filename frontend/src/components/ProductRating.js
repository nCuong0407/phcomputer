import React, { useState, useEffect, useContext } from "react";
import { FaStar } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import Context from "../context";
import SummaryApi from "../common";

const ratingLabels = ["Rất tệ", "Không tệ", "Trung bình", "Tốt", "Tuyệt vời"];

const ProductRating = ({ productId, productName }) => {
  const { user } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingsList, setRatingsList] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0, counts: {} });

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRatings = async () => {
    try {
      const res = await fetch(
        `${SummaryApi.getRatingsByProduct.url}/${productId}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!data || !Array.isArray(data.data)) {
        setRatingsList([]);
        return;
      }
      setRatingsList(data.data);
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
      setRatingsList([]);
      toast.error("Không thể tải danh sách đánh giá. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [productId, user]);

  useEffect(() => {
    let totalRating = 0;
    const counts = {};
    ratingsList.forEach(({ rating }) => {
      totalRating += rating;
      counts[rating] = (counts[rating] || 0) + 1;
    });
    const total = ratingsList.length;
    const average = total ? totalRating / total : 0;
    setStats({ average, total, counts });
  }, [ratingsList]);

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.warning("Vui lòng chọn số sao!");
      return;
    }
    try {
      const res = await fetch(`${SummaryApi.rating.url}/${productId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating }), // Không gửi review nữa
      });
      const data = await res.json();
      if (data?.message) {
        toast.success("Đánh giá đã được gửi!");
        await fetchRatings();
        setIsOpen(false);
        setSelectedRating(0);
      } else {
        toast.error("Đánh giá thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      toast.error("Có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  // Tính danh sách phân trang
  const totalPages = Math.ceil(ratingsList.length / itemsPerPage);
  const currentRatings = ratingsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 p-6 bg-white border rounded-lg shadow-md">
      {/* Thống kê */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center">
          <div className="text-orange-500 text-6xl font-bold">
            {stats.average.toFixed(1)}
          </div>
          <div className="text-sm font-semibold mt-2 text-gray-600">
            ĐÁNH GIÁ TRUNG BÌNH
          </div>
        </div>

        {/* Biểu đồ sao */}
        <div className="flex-1 w-full">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.counts[star] || 0;
            const percentage = stats.total
              ? ((count / stats.total) * 100).toFixed(0)
              : 0;
            return (
              <div className="flex items-center gap-2 text-sm mb-2 whitespace-nowrap">
                <span className="w-8 flex items-center justify-end text-gray-700">
                  {star}
                  <FaStar className="inline text-yellow-400 ml-1" size={12} />
                </span>
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-2"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-600 min-w-[120px] text-right">
                  {percentage}% | {count} đánh giá
                </span>
              </div>
            );
          })}
        </div>

        {/* Nút đánh giá */}
        <div>
          {user ? (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold hover:opacity-90 shadow-md transition"
            >
              ĐÁNH GIÁ NGAY
            </button>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Hãy đăng nhập để đánh giá
            </p>
          )}
        </div>
      </div>

      {/* Modal đánh giá */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <Dialog.Title className="text-lg font-bold mb-4 text-gray-800">
              Đánh giá: <span className="text-orange-600">{productName}</span>
            </Dialog.Title>
            <div className="mb-4">
              <p className="font-semibold mb-3 text-gray-700">
                Bạn cảm thấy thế nào về sản phẩm?
              </p>
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((star, idx) => (
                  <div key={star} className="flex flex-col items-center">
                    <FaStar
                      size={30}
                      className={`cursor-pointer transition ${
                        selectedRating >= star
                          ? "text-orange-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => setSelectedRating(star)}
                    />
                    <span className="text-xs mt-1 text-gray-600">
                      {ratingLabels[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 px-5 py-2 rounded-full hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition"
              >
                GỬI ĐÁNH GIÁ
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductRating;
