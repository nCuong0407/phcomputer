import { useState } from "react";
import { FaPhone, FaTimes, FaShoppingCart, FaTruck } from "react-icons/fa";

const FixedBottomBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleCall = () => {
    window.location.href = "tel:0838191191";
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-2xl">
      {/* Main Banner Content */}
      <div className="relative px-4 py-3 md:py-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-6 h-6 bg-red-700 hover:bg-red-800 rounded-full flex items-center justify-center transition-colors duration-200 md:w-7 md:h-7"
        >
          <FaTimes className="text-white text-xs md:text-sm" />
        </button>

        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Side - Main Message */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-white text-sm md:text-lg" />
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaTruck className="text-white text-sm md:text-lg" />
              </div>
            </div>

            <div className="text-white">
              <h3 className="text-lg md:text-2xl font-bold leading-tight">
                MUA ONLINE - GIAO TẬN NƠI
              </h3>
              <p className="text-xs md:text-sm text-red-100 font-medium">
                Miễn phí giao hàng nội thành • Hỗ trợ 24/7
              </p>
            </div>
          </div>

          {/* Right Side - Phone Number */}
          <div className="flex items-center">
            <button
              onClick={handleCall}
              className="flex items-center space-x-2 md:space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-3 py-2 md:px-4 md:py-3 transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center animate-pulse">
                <FaPhone className="text-red-500 text-sm md:text-lg" />
              </div>
              <div className="text-white text-right">
                <p className="text-xs md:text-sm font-medium text-red-100">
                  Hotline
                </p>
                <p className="text-lg md:text-2xl font-bold leading-tight">
                  0932502254
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div
            className="absolute top-4 right-20 w-1 h-1 bg-white rounded-full animate-ping"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>

      {/* Bottom Shadow */}
      <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-b from-red-600/50 to-transparent"></div>
    </div>
  );
};

export default FixedBottomBanner;
