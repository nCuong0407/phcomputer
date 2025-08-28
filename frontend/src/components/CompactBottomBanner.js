import { useState } from "react";
import { FaPhone, FaTimes } from "react-icons/fa";

const CompactBottomBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleCall = () => {
    window.location.href = "tel:0838191191";
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9998] md:bottom-6 md:left-6">
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg shadow-2xl border-2 border-red-400 overflow-hidden max-w-[280px] md:max-w-[320px]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 w-5 h-5 bg-red-700 hover:bg-red-800 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
        >
          <FaTimes className="text-white text-xs" />
        </button>

        {/* Main Content */}
        <div className="px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center space-x-3">
            {/* Phone Icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <FaPhone className="text-white text-lg md:text-xl animate-pulse" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                MUA ONLINE
              </h3>
              <p className="text-red-100 text-xs md:text-sm font-medium leading-tight">
                Giao tận nơi
              </p>

              {/* Phone Number */}
              <button
                onClick={handleCall}
                className="text-yellow-300 font-bold text-lg md:text-xl leading-tight hover:text-yellow-200 transition-colors duration-200"
              >
                0932502254
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300"></div>

        {/* Animated Dots */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-8 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
          <div
            className="absolute bottom-2 left-8 w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CompactBottomBanner;
