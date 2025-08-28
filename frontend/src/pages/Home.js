import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import LaptopProductGrid from "../components/LaptopProductGrid";
// import FloatingContactWidget from "../components/FloatingContactWidget"; // <-- Dòng này thừa, xóa đi
// import CompactBottomBanner from "../components/CompactBottomBanner"; // <-- TAO ĐÃ XÓA DÒNG NÀY
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import ScrollToTop from "../components/ScrollToTop";
import HorizontalCardRandomProduct from "../components/HorizontalCardRandomProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />
      <LaptopProductGrid />
      <HorizontalCardProduct
        category={"LAPTOP DELL"}
        heading={"LAPTOP DELL NỔI BẬT"}
      />
      <HorizontalCardProduct
        category={"LAPTOP HP"}
        heading={"LAPTOP HP NỔI BẬT"}
      />
      <HorizontalCardRandomProduct heading={"GỢI Ý HÔM NAY DÀNH CHO BẠN"} />
      {/* <CompactBottomBanner /> */} {/* <-- VÀ TAO ĐÃ XÓA DÒNG NÀY */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
