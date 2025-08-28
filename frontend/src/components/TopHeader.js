// src/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TopHeader = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }); // hoặc "smooth" nếu bạn muốn mượt
  }, [pathname]);

  return null;
};

export default TopHeader;
