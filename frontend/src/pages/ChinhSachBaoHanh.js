import React from "react";

const ChinhSachBaoHanh = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Chính Sách Bảo Hành
      </h1>
      <div className="prose max-w-none text-gray-700">
        <p>
          Chính sách bảo hành sản phẩm khi mua tại{" "}
          <strong>Công Ty Tin Học Phan Huyện</strong> được chúng tôi quy định
          như sau.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          Thời gian bảo hành
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Loại sản phẩm</th>
                <th className="py-2 px-4 border-b text-left">
                  Thời gian bảo hành
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Laptop</td>
                <td className="py-2 px-4 border-b">
                  Bảo hành 1 Đổi 1 trong 07 ngày với máy qua sử dụng và 15 ngày
                  cho máy mới 100%
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b"></td>
                <td className="py-2 px-4 border-b">
                  Thời gian bảo hành từ 03 đến 12 tháng, tùy theo từng loại sản
                  phẩm và giá mua theo yêu cầu của khách hàng.
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Phụ kiện pin và sạc</td>
                <td className="py-2 px-4 border-b">
                  Thời gian bảo hành 06 tháng. Sẽ được đổi ngay lập tức nếu còn
                  thời hạn bảo hành và kiểm tra lỗi do nhà sản xuất
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b"></td>
                <td className="py-2 px-4 border-b">
                  Vì là pin chính hãng và là vật liệu tiêu hao nên đảm bảo thời
                  lượng xem youtube trên 1h30p, dưới đó được đổi pin khác, các
                  tháng tiếp theo sẽ được đổi khi pin không sạc vào, pin chết.
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Phần cứng</td>
                <td className="py-2 px-4 border-b">
                  Bảo hành 01 đến 12 tháng, tùy theo sản phẩm quy định và yêu
                  cầu của khách hàng.
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Phần mềm văn phòng</td>
                <td className="py-2 px-4 border-b">
                  Bảo hành hỗ trợ cài đặt phần mềm miễn phí (trong mức cho phép)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          <strong>Đối với các máy hết hạn bảo hành:</strong> hiện tại công ty
          không có bộ phận sửa chữa, vì vậy chúng tôi sẽ không nhận lại máy đã
          hết hạn bảo hành để sửa lỗi cho khách hàng. Chúng tôi sẽ tư vấn phương
          án thay thế hoặc tư vấn địa điểm phục vụ sửa lỗi.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          Điều kiện bảo hành
        </h2>
        <p>
          Tại Công Ty Tin Học Phan Huyện, chúng tôi chỉ chấp nhận bảo hành đối
          với điều kiện sau:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Thiết bị bị hư hỏng do lỗi kỹ thuật hoặc lỗi từ Nhà Sản Xuất.</li>
          <li>
            Khách hàng vui lòng mang máy tính và phiếu bảo hành trực tiếp đến
            cửa hàng.
          </li>
          <li>
            Đối với các sản phẩm và thiết bị bị được cấp phiếu bảo hành, khách
            hàng vui lòng xuất trình phiếu bảo hành có dán tem bảo hành của Công
            Ty Tin Học Phan Huyện, đảm bảo còn trong thời hạn bảo hành.
          </li>
          <li>
            Tem bảo hành phải đảm bảo còn nguyên vẹn, không có dấu hiệu cạo sửa,
            tẩy, xóa, bị rách, mờ.
          </li>
          <li>
            Các máy nếu nằm trong danh mục được bảo hành, nếu xử lý được tại chỗ
            bộ phận kỹ thuật sẽ xử lý ngay lập tức để khách hàng có máy sử dụng.
            Nếu mất thời gian nhiều hơn thì shop xin phép giữ máy lại để kiểm
            tra và kỹ thuật sẽ chủ động liên hệ đến quý khách khi máy được xử lý
            xong.
          </li>
        </ul>
        <p className="mt-4">
          Tại <strong>Công Ty Tin Học Phan Huyện</strong>, chúng tôi chỉ giữ lại
          Laptop khi tiếp nhận để bảo hành, không nhận bất cứ linh kiện, phụ
          kiện nào kèm theo (balo, túi chống sốc, sạc, giấy tờ,...). Trừ trường
          hợp kỹ thuật có yêu cầu giữ lại sạc để kiểm tra và có ghi rõ trên
          phiếu tiếp nhận bảo hành ==&gt; quý khách vui lòng kiểm tra phiếu tiếp
          nhận đầy đủ và ký xác nhận trước khi rời cửa hàng.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          Những trường hợp từ chối bảo hành
        </h2>
        <p>
          Công Ty Tin Học Phan Huyện từ chối không nhận bảo hành đối với những
          trường hợp sau.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Về tem bảo hành
        </h3>
        <ul className="list-disc list-inside ml-4">
          <li>
            Thiết bị không có tem bảo hành của{" "}
            <strong>Công Ty Tin Học Phan Huyện</strong>
          </li>
          <li>
            Số serial number trên tem bảo hành của thiết bị, bị rách, mờ hay có
            dấu hiệu chập vá, cạo sửa,...
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Về phần mềm
        </h3>
        <ul className="list-disc list-inside ml-4">
          <li>Phần mềm bị lỗi hoặc virus do người sử dụng.</li>
          <li>
            Tất cả những phát sinh liên quan đến software ứng dụng và hệ điều
            hành
          </li>
          <li>
            Chúng tôi không chịu trách nhiệm bảo hành phần mềm và dữ liệu trong
            thiết bị bị lưu trữ của khách hàng khi bảo hành thiết bị tại{" "}
            <strong>Công Ty Tin Học Phan Huyện</strong>.
          </li>
          <li>
            Không bảo hành trường hợp do khách hàng tự ý đặt Password Window /
            Password BIOS (laptop).
          </li>
        </ul>
        <p className="italic ml-4">
          (***) Lưu ý: Ưu tiên sử dụng phần mềm có bản quyền để tránh các lỗi có
          thể phát sinh
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Về màn hình máy tính
        </h3>
        <ul className="list-disc list-inside ml-4">
          <li>
            Màn hình cần bể sọc chỉ do va chạm, do vận chuyển. Số điểm chết nhỏ
            hơn 5 điểm, màn hình bị đốm sáng.
          </li>
          <li>
            Không bảo hành LCD với các trường hợp bầm, cấn, bụi, ố. Với điểm
            chết LCD bảo hành theo quy định của từng hãng sản xuất (thông thường
            từ 5-7 điểm chết gần nhau)
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Về phần cứng
        </h3>
        <ul className="list-disc list-inside ml-4">
          <li>
            Không bảo hành trong trường hợp máy bật không lên, mất VGA rời, treo
            BIOS, khởi động chậm... Do khách hàng tự ý nâng/hạ Bios, Rom.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Về thiết bị kết nối, nhập và xuất trên máy tính
        </h3>
        <ul className="list-disc list-inside ml-4">
          <li>
            Không bảo hành chân sạc, chân sim, chân thẻ nhớ, lỗ cắm tai nghe,
            Camera. Do thời gian đầu chưa quen sử dụng, rất nhiều khách hàng đã
            dùng không đúng cách gây ra những lỗi này nên chúng tôi không thể
            nhận bảo hành.
          </li>
          <li>
            Không giải quyết đổi – trả sau khi mua hàng cho yếu tố cá nhân từ
            khách hàng như: loa nghe nhỏ, máy chạy chậm, bàn phím cứng, màn hình
            tối, máy khó xài...
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Các lỗi khác
        </h3>
        <ul className="list-disc list-inside ml-4">
          <li>
            Sử dụng sai nguồn điện, sốc điện, điện áp vào không ổn định. Vận
            chuyển, bảo quản không đúng cách.
          </li>
          <li>
            Sản phẩm không còn nguyên vẹn do tác động bề mặt vật lý như: bị rơi,
            va chạm, cháy nổ do lỗi nhà sản xuất hoặc do sử dụng của khách hàng,
            bể mẻ.
          </li>
          <li>Sản phẩm có dấu hiệu người dùng tự ý sửa chữa.</li>
          <li>
            Thiết bị đã được sử dụng trong môi trường ẩm ướt, vô nước, bụi bặm,
            từ trường cao, bị oxy hóa, hay trực tiếp dưới ánh nắng mặt trời và
            có dấu hiệu cháy nổ hoặc do côn trùng, chuột bọ phá hoại, hoặc hư
            hỏng do thiên tai, hỏa hoạn.
          </li>
          <li>
            Cửa hàng không giải quyết mọi lý do đổi hoặc trả lại máy nếu tình
            trạng máy bình thường.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          Phương thức bảo hành
        </h2>
        <ul className="list-disc list-inside ml-4">
          <li>
            Thời gian giải quyết bảo hành từ 03 – 07 ngày kể từ ngày nhận (trừ
            Chủ Nhật và Lễ Tết) và tùy theo tình trạng hư hỏng của sản phẩm có
            thể giải quyết sớm hoặc chậm hơn.
          </li>
          <li>
            Đối với sản phẩm tem còn bảo hành nhưng nằm trong trường hợp lỗi
            phần mềm hoặc virus do người sử dụng – không được bảo hành, chúng
            tôi chỉ tạm nhận hỗ trợ, trong quá trình hỗ trợ nếu phát sinh chi
            phí, chúng tôi sẽ thông báo đến Khách Hàng trước khi xử lý.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          Quy định đổi sản phẩm mới
        </h2>
        <ul className="list-disc list-inside ml-4">
          <li>
            Quý khách sử dụng sản phẩm mua tại{" "}
            <strong>Công Ty Tin Học Phan Huyện</strong> trong 07 ngày đầu tiên
            nếu bị lỗi kỹ thuật, lỗi do nhà sản xuất hoặc không tương thích với
            nhu cầu sẽ được đổi máy khác cùng model hoặc khác model với giá trị
            tương đương hoặc cao hơn.
          </li>
          <li>
            Nếu không còn model giống với sản phẩm đã mua và quý khách sẽ không
            được chọn model tương đương hoặc cao hơn. Trong trường hợp này,
            chúng tôi sẽ hoàn lại tiền cho khách hàng 100%.
          </li>
        </ul>
        <p className="mt-4">
          Để biết thêm thông tin chi tiết, quý khách có thể xem thêm tại Chính
          sách đổi trả tại <strong>Công Ty Tin Học Phan Huyện</strong>.
        </p>

        <p className="mt-8 font-bold">
          KHÁCH HÀNG VUI LÒNG KIỂM TRA LẠI HÀNG HÓA VÀ ĐẶC TỰ TRẠNG CẢ NHÂN
          TRƯỚC KHI RỜI KHỎI CỬA HÀNG.
        </p>
        <p className="mt-4">
          Cảm ơn quý khách đã tin tưởng và chọn lựa sản phẩm của{" "}
          <strong>Công Ty Tin Học Phan Huyện</strong>! Chúng tôi luôn mong muốn
          lắng nghe phản hồi từ khách hàng để hoàn thiện chính sách ngày càng
          tốt hơn.
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
              #/
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChinhSachBaoHanh;
