import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common/index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Context from '../context';

const SignupOtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  // Kiểm tra nếu không có email từ trang signup/login thì quay lại signup
  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/sign-up");
    }
  }, [location, navigate]);

  // Kiểm tra xem có phải từ trang login không
  const isFromLogin = location?.state?.fromLogin || false;

  // Kiểm tra tất cả các ô OTP đã nhập chưa
  const valideValue = data.every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!valideValue) {
      toast.error("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    try {
      setLoadingVerify(true);
      
      const response = await fetch(SummaryApi.verifySignupOtp.url, {
        method: SummaryApi.verifySignupOtp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: data.join(""), // ghép chuỗi OTP
          email: location?.state?.email
        })
      });

      const dataApi = await response.json();

      if (dataApi.error) {
        toast.error(dataApi.message || "OTP không đúng hoặc đã hết hạn");
        return;
      }

      if (dataApi.success) {
        toast.success(dataApi.message || "Xác thực tài khoản thành công!");
        setData(["", "", "", "", "", ""]);
        
        if (isFromLogin) {
          // ✅ XỬ LÝ: Nếu từ trang login, sử dụng auto login endpoint
          try {
            const autoLoginResponse = await fetch(SummaryApi.autoLoginAfterOtp.url, {
              method: SummaryApi.autoLoginAfterOtp.method,
              credentials: 'include',
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                email: location?.state?.email
              })
            });

            const loginData = await autoLoginResponse.json();
            
            if (loginData.success) {
              // Fetch user data sau khi đăng nhập
              if (fetchUserDetails) {
                fetchUserDetails();
              }
              if (fetchUserAddToCart) {
                fetchUserAddToCart();
              }
              
              toast.success("Đăng nhập thành công!");
              setTimeout(() => {
                navigate("/");
              }, 1500);
            } else {
              // Nếu không thể tự động đăng nhập, chuyển về trang login
              toast.success("Xác thực thành công! Vui lòng đăng nhập lại.");
              setTimeout(() => {
                navigate("/login");
              }, 1500);
            }
          } catch (error) {
            console.log('Auto login error:', error);
            toast.success("Xác thực thành công! Vui lòng đăng nhập lại.");
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }
        } else {
          // Nếu từ trang signup, chuyển về trang đăng nhập
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoadingVerify(false);
    }
  };

  // Hàm gửi lại OTP
  const handleResendOtp = async () => {
    try {
      setLoadingResend(true);

      const response = await fetch(SummaryApi.resendSignupOtp.url, {
        method: SummaryApi.resendSignupOtp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: location?.state?.email
        })
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        toast.success(dataApi.message || "OTP mới đã được gửi!");
        setData(["", "", "", "", "", ""]); // Reset OTP input
      } else {
        toast.error(dataApi.message || "Không thể gửi lại OTP");
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <div className="text-center mb-6">
          <h2 className='font-semibold text-xl mb-2'>
            {isFromLogin ? 'Xác thực tài khoản để đăng nhập' : 'Xác thực tài khoản'}
          </h2>
          <p className='text-gray-600'>
            Mã OTP đã được gửi đến email: <br/>
            <span className='font-medium text-blue-600'>{location?.state?.email}</span>
          </p>
          {isFromLogin && (
            <p className='text-sm text-orange-600 mt-2'>
              Tài khoản của bạn chưa được xác thực. Vui lòng nhập OTP để hoàn tất đăng nhập.
            </p>
          )}
        </div>

        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='otp' className='font-medium'>Nhập mã OTP (6 số):</label>
            <div className='flex items-center gap-2 justify-between mt-3'>
              {data.map((element, index) => (
                <input
                  key={"otp" + index}
                  type='text'
                  id={'otp' + index}
                  ref={(ref) => {
                    inputRef.current[index] = ref;
                    return ref;
                  }}
                  value={data[index]}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ""); // chỉ cho nhập số
                    const newData = [...data];
                    newData[index] = value;
                    setData(newData);

                    // Tự động chuyển sang ô tiếp theo khi nhập
                    if (value && index < 5) {
                      inputRef.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    // Xử lý phím Backspace để quay lại ô trước
                    if (e.key === 'Backspace' && !data[index] && index > 0) {
                      inputRef.current[index - 1]?.focus();
                    }
                  }}
                  maxLength={1}
                  className='bg-slate-100 w-full max-w-16 p-3 border rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-center font-semibold text-lg'
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!valideValue || loadingVerify}
            className={`${valideValue && !loadingVerify 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-gray-400 cursor-not-allowed"} 
              text-white py-3 rounded-lg font-semibold my-3 transition-colors`}
          >
            {loadingVerify ? "Đang xác thực..." : "Xác thực OTP"}
          </button>
        </form>

        {/* Nút Gửi lại OTP */}
        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loadingResend}
            className={`text-sm font-semibold ${
              loadingResend 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-red-600 hover:text-red-700"
            }`}
          >
            {loadingResend ? "Đang gửi..." : "Gửi lại OTP"}
          </button>
        </div>

        <p className='text-center mt-6 text-gray-600'>
          Đã có tài khoản?{" "}
          <Link to={"/login"} className='font-semibold text-red-600 hover:text-red-700'>
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignupOtpVerification;