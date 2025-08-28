import React from "react";

const GioiThieu = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        GIỚI THIỆU CÔNG TY TNHH MTV TM DV TIN HỌC PHAN HUYỆN
      </h1>
      <div className="prose max-w-none text-gray-700">
        <p>
          Công ty TNHH MTV TM DV Tin học Phan Huyện được thành lập vào ngày{" "}
          <strong>14/03/2008</strong>, với trụ sở đặt tại{" "}
          <strong>
            188/49 Tân Kỳ Tân Quý, Phường Sơn Kỳ, Quận Tân Phú, TP. Hồ Chí Minh
          </strong>
          . Trải qua nhiều năm hình thành và phát triển, công ty đã từng bước
          khẳng định vị thế của mình trong lĩnh vực{" "}
          <strong>
            bán buôn thiết bị máy tính, cung cấp dịch vụ sửa chữa và giải pháp
            phần mềm tin học
          </strong>
          .
        </p>
        <p>
          Với đội ngũ kỹ thuật viên giàu kinh nghiệm, thái độ phục vụ chuyên
          nghiệp và tinh thần luôn đổi mới. Tin học Phan Huyện không ngừng nâng
          cao chất lượng dịch vụ nhằm đáp ứng nhu cầu ngày càng đa dạng của
          khách hàng.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">
          LĨNH VỰC HOẠT ĐỘNG
        </h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Bán buôn thiết bị máy tính:</strong> cung cấp laptop, PC,
            linh kiện máy tính chính hãng, đa dạng mẫu mã và cấu hình phù hợp
            với nhiều đối tượng người dùng.
          </li>
          <li>
            <strong>Dịch vụ bảo trì – sửa chữa:</strong> bảo trì hệ thống máy
            tính, mạng nội bộ cho các doanh nghiệp, trường học và cơ quan nhà
            nước.
          </li>
          <li>
            <strong>Giải pháp phần mềm:</strong> tư vấn, triển khai các phần mềm
            quản lý phù hợp với đặc thù hoạt động của từng đơn vị.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">
          KHÁCH HÀNG MỤC TIÊU
        </h2>
        <p>
          Tin học Phan Huyện cung cấp dịch vụ cho nhiều nhóm khách hàng như:
        </p>
        <ul className="list-disc list-inside">
          <li>Doanh nghiệp</li>
          <li>Trường học</li>
          <li>Cơ quan nhà nước</li>
          <li>Khách hàng cá nhân có nhu cầu về thiết bị và dịch vụ tin học</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">
          ƯU ĐIỂM CẠNH TRANH
        </h2>
        <ul className="list-disc list-inside">
          <li>Sản phẩm chất lượng, bảo hành chính hãng</li>
          <li>Dịch vụ hậu mãi tận tâm và nhanh chóng</li>
          <li>Hỗ trợ kỹ thuật linh hoạt, chuyên nghiệp</li>
          <li>Giá cả cạnh tranh, minh bạch</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">
          THÔNG TIN LIÊN HỆ
        </h2>
        <ul className="list-disc list-inside">
          <li>Email: tinhocphanhuyen@gmail.com</li>
          <li>Điện thoại: 0932 502 254</li>
          <li>Địa chỉ: 188/49 Tân Kỳ Tân Quý, P. Sơn Kỳ, Q. Tân Phú, TP.HCM</li>
        </ul>
      </div>
    </div>
  );
};

export default GioiThieu;
