// frontend/src/helpers/apiHelper.js
import { toast } from 'react-toastify';

export const handleApiCall = async (apiCall, navigate) => {
  try {
    const response = await apiCall();
    const data = await response.json();
    
    // ✅ KIỂM TRA: Nếu API trả về yêu cầu xác thực OTP
    if (data.requireOtpVerification) {
      toast.error(data.message || "Vui lòng xác thực tài khoản trước khi sử dụng tính năng này");
      
      // Chuyển hướng đến trang xác thực OTP
      navigate("/signup-otp-verification", {
        state: {
          email: data.email,
          fromLogin: true
        }
      });
      return null; // Dừng xử lý
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    toast.error("Có lỗi xảy ra, vui lòng thử lại");
    return null;
  }
};

// Hook để sử dụng trong các component
export const useApiCall = () => {
  const navigate = useNavigate();
  
  const callApi = async (apiCall) => {
    return handleApiCall(apiCall, navigate);
  };
  
  return { callApi };
};