import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import mapImg from "../assest/map.jpg";
import { Link } from "react-router-dom"; // Đảm bảo dòng này đã có

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* THÔNG TIN LIÊN HỆ */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-white">
              THÔNG TIN LIÊN HỆ
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex flex-col space-y-1">
                <div className="flex items-start space-x-2">
                  <FaMapMarkerAlt className="text-yellow-300 mt-1 flex-shrink-0" />
                  <p>30 Đô Đốc Chấn, Phường Sơn kỳ, Quận Tân Phú - HCM</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold mb-2">
                  Phản hồi chất lượng dịch vụ
                </p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-yellow-300" />
                    <span>Kinh doanh: 0932502254</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-yellow-300" />
                    <span>Hỗ trợ kỹ thuật: 0932502254</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-yellow-300" />
                    <span>Email: tinhocphanhuyen@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <a
                href="https://www.google.com/maps?q=30+Đô+Đốc+Chấn,+Phường+Sơn+Kỳ,+Tân+Phú,+Hồ+Chí+Minh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-2 inline-block"
              >
                <img
                  src={mapImg || "/placeholder.svg"}
                  alt="Google Maps"
                  className=" h-12 w-auto mr-2"
                />
              </a>
            </div>
          </div>
          {/* THỜI GIAN LÀM VIỆC */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-white">
              THỜI GIAN LÀM VIỆC
            </h3>
            <div className="space-y-3 text-base">
              <div>
                <p className="font-semibold text-yellow-300 mb-2">
                  Bán hàng: Thứ 2 - Chủ nhật
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Thứ 2 - Thứ 7: 8:30 đến 19:00</li>
                  <li>• Chủ nhật: 09:00 đến 17:00</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-yellow-300 mb-2">
                  Bảo hành: Thứ 2 - Thứ 7
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Sáng: 9:00 đến 12:00</li>
                  <li>• Chiều: 13:30 đến 17:00</li>
                </ul>
              </div>
            </div>
          </div>
          {/* THÔNG TIN DỊCH VỤ */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-white">
              THÔNG TIN DỊCH VỤ
            </h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link
                  to="/gioi-thieu"
                  className="hover:text-yellow-300 transition-colors"
                >
                  • Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/huong-dan-mua-hang"
                  className="hover:text-yellow-300 transition-colors"
                >
                  • Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/mua-laptop-tra-gop"
                  className="hover:text-yellow-300 transition-colors"
                >
                  • Mua Laptop trả góp
                </Link>
              </li>
              <li>
                <Link
                  to="/chinh-sach-doi-tra"
                  className="hover:text-yellow-300 transition-colors"
                >
                  • Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="/chinh-sach-bao-hanh"
                  className="hover:text-yellow-300 transition-colors"
                >
                  • Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  to="/chinh-sach-giao-nhan"
                  className="hover:text-yellow-300 transition-colors"
                >
                  • Chính sách Giao - Nhận
                </Link>
              </li>
              <li>
                <Link
                  to="/chinh-sach-bao-mat-thong-tin"
                  className="hover:text-yellow-300 transition-colors"
                >
                  • Chính sách Bảo mật thông tin
                </Link>
              </li>
            </ul>
          </div>
          {/* VỀ CHÚNG TÔI */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4 text-white">VỀ CHÚNG TÔI</h3>
            <div className="space-y-3 text-base">
              <p>
                • Hộ Kinh Doanh:{" "}
                <span className="font-semibold">Phan Huyện Computer</span>
              </p>
              <p>
                • Người đại diện:{" "}
                <span className="font-semibold">Nguyễn Thị Hậu</span>
              </p>
              {/* <p>
                • GPKD: <span className="font-semibold">XXXXXXX</span> – Cấp tại
                UBND Quận XXXX, TP.Hồ Chí Minh – Cấp ngày: XX/XX/XXXX
              </p> */}
              {/* <p>
                • MST: <span className="font-semibold">XXXXXXXX</span> – Cấp tại
                Chi cục Thuế Quận XXXXXXX – TP. HCM – cấp ngày: XX/XX/XXXX
              </p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-700 py-3">
        <div className="container mx-auto px-4">
          <p className="text-center text-base text-gray-300">
            Copyright 2025: Thiết kế và SEO bởi Công Ty Tin Học Phan Huyện.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
