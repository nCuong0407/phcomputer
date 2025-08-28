import React from "react";

const ChinhSachDoiTra = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Chính Sách Đổi Trả
      </h1>
      <div className="prose max-w-none text-gray-700">
        <p>
          Tại Công Ty Tin Học Phan Huyện, chính sách đổi trả sản phẩm và mức chi
          phí được chúng tôi quy định như sau.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          1. Chính sách chung
        </h2>
        <p>
          Chúng tôi không áp dụng chính sách đổi trả đối với sản phẩm mắc các
          lỗi sau:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Ram</li>
          <li>Ổ cứng</li>
          <li>Pin</li>
          <li>Sạc</li>
          <li>Bàn phím</li>
          <li>LCD bị điểm chết</li>
        </ul>
        <p className="mt-4">
          Trong 7 ngày đầu sau khi mua hàng, khách hàng khi có nhu cầu đổi trả
          sản phẩm phải đảm bảo tình trạng sản phẩm nguyên vẹn như lúc mua,
          không trầy xước và móp méo. Trong trường hợp sản phẩm có dấu hiệu hao
          mòn, nếu đủ điều kiện sẽ được chuyển qua bảo hành.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          2. Chính sách đổi trả từng trường hợp
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          2.1 Đối với sản phẩm bị lỗi (do Nhà Sản Xuất):
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Thời gian</th>
                <th className="py-2 px-4 border-b text-left">Phí đổi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">7 ngày đầu tiên</td>
                <td className="py-2 px-4 border-b">Miễn phí</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Từ 8 – 21 ngày</td>
                <td className="py-2 px-4 border-b">Trừ 15% trên giá mua</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Từ 22 – 35 ngày</td>
                <td className="py-2 px-4 border-b">Trừ 20% trên giá mua</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Mỗi ngày tiếp theo</td>
                <td className="py-2 px-4 border-b">Cộng thêm 0.15%/ngày</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          2.2 Đối với sản phẩm không bị lỗi
        </h3>
        <p className="italic">(Khuyến khích khách hàng nên giữ máy sử dụng)</p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Thời gian</th>
                <th className="py-2 px-4 border-b text-left">Phí đổi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">7 ngày đầu tiên</td>
                <td className="py-2 px-4 border-b">Trừ 30% trên giá mua</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Từ 8 – 21 ngày</td>
                <td className="py-2 px-4 border-b">Trừ 35% trên giá mua</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Cứ mỗi ngày tiếp theo</td>
                <td className="py-2 px-4 border-b">Cộng thêm 0.15%/1 ngày</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Lưu ý:</h3>
        <ul className="list-disc list-inside ml-4">
          <li>Hàng đã mua, chúng tôi không nhận trả lại.</li>
          <li>
            Hiện tại, Công Ty Tin Học Phan Huyện ngừng mua lại các sản phẩm đã
            bán ra và ngừng thu mua máy cũ. Việc thu mua lại máy sẽ hỗ trợ qua
            thoả thuận trực tiếp với người mua tại thời điểm khách hàng muốn
            bán.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          2.3 Sản phẩm bị lỗi do người sử dụng
        </h3>
        <p>
          Theo quy định của Nhà Sản Xuất, chúng tôi không áp dụng chính sách đổi
          trả đối với sản phẩm mắc các lỗi sau do người sử dụng:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Sản phẩm không còn tem bảo hành</li>
          <li>Sản phẩm bị cấn móp do rơi và va chạm</li>
          <li>Sản phẩm bị trầy xước</li>
          <li>Sản phẩm bị vào nước,...</li>
        </ul>
        <p className="mt-4">
          Nếu gặp phải các trường hợp trên, khách hàng vui lòng chịu chi phí sửa
          chữa sản phẩm.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          3. Điều kiện đổi trả
        </h2>
        <p>Khi thực hiện đổi trả sản phẩm, quý khách vui lòng mang theo:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Hóa đơn mua hàng</li>
          <li>Phiếu bảo hành (nếu có) và phụ kiện đi kèm</li>
          <li>Quà khuyến mãi có giá trị (nếu có)</li>
        </ul>
        <p className="mt-4">
          Đối với trường hợp thiếu các điều kiện trên: chúng tôi sẽ thu phí theo
          quy định. Ngoài ra, KHÔNG thu thêm bất kỳ phí nào khác.
        </p>
        <p className="mt-4">
          Cảm ơn quý khách đã tin tưởng và chọn lựa sản phẩm của Công Ty Tin Học
          Phan Huyện! Chúng tôi luôn mong muốn lắng nghe phản hồi từ khách hàng
          để hoàn thiện sản phẩm ngày càng tốt hơn.
        </p>

        <p className="mt-8 font-bold">Công Ty Tin Học Phan Huyện.</p>
        <ul className="list-disc list-inside ml-4">
          <li>Hotline: 0932502254</li>
          <li>Địa chỉ: 30 Đô Đốc Chấn, Phường Sơn kỳ, Quận Tân Phú – HCM.</li>
          <li>Email: tinhocphanhuyen@gmail.com</li>
          <li>
            Website:{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              #
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChinhSachDoiTra;
