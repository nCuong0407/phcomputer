// frontend/src/hooks/useProtectedApi.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useProtectedApi = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpModalData, setOtpModalData] = useState({});
  const navigate = useNavigate();

  const callProtectedApi = async (apiCall) => {
    try {
      const response = await apiCall();
      const data = await response.json();

      // ✅ KIỂM TRA: Nếu API yêu cầu xác thực OTP
      if (data.requireOtpVerification) {
        setOtpModalData({
          email: data.email,
          message: data.message
        });
        setShowOtpModal(true);
        return null; // Dừng xử lý
      }

      return data;
    } catch (error) {
      console.error('Protected API Error:', error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      return null;
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtpModalData({});
  };

  const goToOtpVerification = () => {
    navigate("/signup-otp-verification", {
      state: {
        email: otpModalData.email,
        fromLogin: true
      }
    });
    closeOtpModal();
  };

  return {
    callProtectedApi,
    showOtpModal,
    otpModalData,
    closeOtpModal,
    goToOtpVerification
  };
};