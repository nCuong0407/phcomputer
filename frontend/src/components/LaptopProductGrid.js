import React from "react";
import giaohangBanner from "../assest/giao-hang-tan-nha-tphcm.jpg";

const LaptopProductGrid = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Tiêu đề */}
      <div className="mb-4 text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 inline-block mr-2">
          LAPTOP ĐỒ HỌA
        </h2>
        <span className="inline-block text-yellow-500 text-3xl">⚡</span>
        <span className="text-orange-600 text-xl font-bold ml-2">GIÁ TỐT</span>
      </div>

      {/* Banner hình ảnh */}
      <div>
        <img
          src={giaohangBanner}
          alt="Giao hàng tận nhà"
          className="w-full h-auto rounded-md shadow"
        />
      </div>
    </div>
  );
};

export default LaptopProductGrid;
