import React, { useEffect, useRef, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

// Desktop images
import image1 from "../assest/banner/Home.webp";
import image2 from "../assest/banner/thang_04_pc_tang_man_banner_web_slider_800x400.jpg";
import image3 from "../assest/banner/thang_06_peri_800x400_-_web_slider.png";
import image4 from "../assest/banner/man_hinh_thang_04_banner_web_slider_800x400.jpg";
import image5 from "../assest/banner/thu_cu_doi_moi_banner_web_slider_800x400.jpg";

// Mobile images
import image1Mobile from "../assest/banner/z7-f7-pre-home.webp";
import image2Mobile from "../assest/banner/gigahoe.webp";
import image3Mobile from "../assest/banner/reno14-new.webp";
import image4Mobile from "../assest/banner/redmipad2-new.webp";
import image5Mobile from "../assest/banner/thang_06_peri_800x400_-_web_slider.png";

const BannerProduct = () => {
  const desktopImages = [image1, image2, image3, image4, image5];
  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ];

  const [currentIndex, setCurrentIndex] = useState(1); // Start from 1 because of clone
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef(null);
  const slideRef = useRef();

  const totalImages = desktopImages.length;

  const nextImage = () => {
    if (currentIndex >= totalImages + 1) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevImage = () => {
    if (currentIndex <= 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTransitionEnd = (images) => {
    if (currentIndex === 0) {
      // Đang ở clone cuối -> quay về ảnh thật cuối
      setTransition(false);
      setCurrentIndex(images.length);
    } else if (currentIndex === images.length + 1) {
      // Đang ở clone đầu -> quay về ảnh thật đầu
      setTransition(false);
      setCurrentIndex(1);
    }
  };
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Reset slide khi quay lại tab
        stopAutoSlide();
        setTransition(false);
        setCurrentIndex(1); // về ảnh đầu thật
        setTimeout(() => {
          setTransition(true);
          startAutoSlide();
        }, 50);
      } else {
        stopAutoSlide();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!transition) {
      // Tắt transition để không thấy chuyển động rồi bật lại sau 50ms
      setTimeout(() => {
        setTransition(true);
      }, 50);
    }
  }, [transition]);

  const renderImages = (images) => {
    // Clone ảnh cuối và đầu để hỗ trợ vòng lặp mượt
    const extendedImages = [images[images.length - 1], ...images, images[0]];

    return (
      <div
        ref={slideRef}
        className="flex h-full will-change-transform"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: transition ? "transform 0.6s ease-in-out" : "none",
          width: `${extendedImages.length * 100}%`,
        }}
        onTransitionEnd={() => handleTransitionEnd(images)}
      >
        {extendedImages.map((url, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 flex items-center justify-center"
            style={{ width: "100%" }}
          >
            <img
              src={url}
              alt={`banner-${index}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[900px] mx-auto px-4">
      <div className="relative overflow-hidden rounded-lg h-48 md:h-[400px] bg-slate-200">
        {/* Nút chuyển (desktop) */}
        <div className="absolute z-10 top-0 bottom-0 left-0 right-0 hidden md:flex justify-between items-center px-4">
          <button
            onClick={prevImage}
            className="bg-white hover:bg-slate-100 shadow-md rounded-full p-2 text-xl"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={nextImage}
            className="bg-white hover:bg-slate-100 shadow-md rounded-full p-2 text-xl"
          >
            <FaAngleRight />
          </button>
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {renderImages(desktopImages)}
        </div>

        {/* Mobile view */}
        <div className="flex md:hidden h-full w-full overflow-hidden">
          {renderImages(mobileImages)}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
