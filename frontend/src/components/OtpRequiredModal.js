// frontend/src/components/OtpRequiredModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OtpRequiredModal = ({ isOpen, onClose, email, message }) => {
  const navigate = useNavigate();

  const handleGoToOtp = () => {
    navigate("/signup-otp-verification", {
      state: {
        email: email,
        fromLogin: true
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-4">Tài khoản chưa xác thực</h2>
          <p className="text-gray-600 mb-6">
            {message || "Vui lòng xác thực tài khoản bằng mã OTP để sử dụng tính năng này."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Để sau
            </button>
            <button
              onClick={handleGoToOtp}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xác thực ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpRequiredModal;