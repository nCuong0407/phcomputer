import React from "react";

const ChinhSachBaoMatThongTin = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Chính sách bảo mật thông tin
      </h1>
      <div className="prose max-w-none text-gray-700">
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          1. Mục đích và phạm vi thu thập thông tin
        </h2>
        <p>
          Công Ty Tin Học Phan Huyện không bán, chia sẻ hay trao đổi thông tin
          cá nhân của khách hàng thu thập trên trang web cho một bên thứ ba nào
          khác.
        </p>
        <p>
          Thông tin cá nhân thu thập được sẽ chỉ được sử dụng trong nội bộ công
          ty.
        </p>
        <p>
          Khi bạn liên hệ đăng ký dịch vụ, thông tin cá nhân mà Công Ty Tin Học
          Phan Huyện thu thập bao gồm:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Họ và tên</li>
          <li>Địa chỉ</li>
          <li>Điện thoại</li>
          <li>Email</li>
        </ul>
        <p className="mt-4">
          Ngoài thông tin cá nhân là các thông tin về dịch vụ
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Tên sản phẩm</li>
          <li>Số lượng</li>
          <li>Thời gian giao nhận sản phẩm</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          2. Phạm vi sử dụng thông tin
        </h2>
        <p>
          Thông tin cá nhân thu thập được sẽ chỉ được sử dụng bởi Công Ty Tin
          Học Phan Huyện trong nội bộ công ty và cho một hoạt tất cả các mục
          đích sau đây:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Hỗ trợ khách hàng</li>
          <li>Cung cấp thông tin liên quan đến dịch vụ</li>
          <li>
            Xử lý đơn đặt hàng và cung cấp dịch vụ và thông tin qua trang web
            của chúng tôi theo yêu cầu của bạn
          </li>
          <li>
            Chúng tôi có thể sẽ gửi thông tin sản phẩm, dịch vụ mới, thông tin
            về các sự kiện sắp tới hoặc thông tin tuyển dụng nếu quý khách đăng
            kí nhận email thông báo.
          </li>
          <li>
            Ngoài ra, chúng tôi sẽ sử dụng thông tin bạn cung cấp để hỗ trợ quản
            lý tài khoản khách hàng, xác nhận và thực hiện các giao dịch tài
            chính liên quan đến các khoản thanh toán trực tuyến của bạn;
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          3. Thời gian lưu trữ thông tin
        </h2>
        <p>
          Đối với thông tin cá nhân, Công Ty Tin Học Phan Huyện chỉ xóa dữ liệu
          nếu khách hàng có yêu cầu, khách hàng yêu cầu gửi email về
          tinhocphanhuyen@gmail.com
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          4. Những người hoặc tổ chức có thể được tiếp cận với thông tin cá nhân
        </h2>
        <p>
          Đối tượng được tiếp cận với thông tin cá nhân của khách hàng thuộc một
          trong những trường hợp sau:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>HỘ KINH DOANH LAPTOP Công Ty Tin Học Phan Huyện</li>
          <li>
            Các đối tác có ký hợp đồng thực hiện 1 phần dịch vụ do HỘ KINH DOANH
            LAPTOP Công Ty Tin Học Phan Huyện. Các đối tác này sẽ nhận được
            những thông tin theo thỏa thuận hợp đồng (có thể 1 phần hoặc toàn bộ
            thông tin tùy theo điều khoản hợp đồng) để tiến hành hỗ trợ người
            dùng sử dụng dịch vụ do Công ty cung cấp.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          5. Địa chỉ đơn vị thu thập và quản lý thông tin cá nhân
        </h2>
        <p className="font-bold">
          HỘ KINH DOANH LAPTOP Công Ty Tin Học Phan Huyện
        </p>
        <p>Địa chỉ: 30 Đô Đốc Chấn, Phường Sơn kỳ, Quận Tân Phú</p>
        <p>Điện thoại: 0932502254</p>
        <p>
          Website:{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            #
          </a>
        </p>
        <p>Email: tinhocphanhuyen@gmail.com</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          6. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu
          cá nhân của mình
        </h2>
        <p>
          Công Ty Tin Học Phan Huyện không thu thập thông tin khách hàng qua
          trang web, thông tin cá nhân khách hàng được thực hiện thu thập qua
          email liên hệ đặt mua sản phẩm, dịch vụ gửi về hộp mail của chúng tôi:
          tinhocphanhuyen@gmail.com hoặc số điện thoại{" "}
          <span className="font-bold">0932502254</span>
        </p>
        <p className="mt-4">
          Bạn có thể liên hệ địa chỉ email cung số điện thoại trên để yêu cầu
          Công Ty Tin Học Phan Huyện chỉnh sửa dữ liệu cá nhân của mình.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">
          7. Cơ chế tiếp nhận và giải quyết khiếu nại
        </h2>
        <p>
          Tiêu đề/nội dung liên quan đến việc thông tin cá nhân bị sử dụng sai
          mục đích hoặc phạm vi đã thông báo
        </p>
        <p className="mt-4">
          Tại Công Ty Tin Học Phan Huyện, việc bảo vệ thông tin cá nhân của bạn
          là rất quan trọng, bạn được đảm bảo rằng thông tin cung cấp cho chúng
          tôi sẽ được mật Công Ty Tin Học Phan Huyện cam kết không chia sẻ, bán
          hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ người nào khác.
          LAPTOP của Công Ty Tin Học Phan Huyện cam kết chỉ sử dụng các thông
          tin của bạn vào các trường hợp sau:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Nâng cao chất lượng dịch vụ dành cho khách hàng</li>
          <li>Giải quyết các tranh chấp, khiếu nại</li>
          <li>Khi cơ quan pháp luật có yêu cầu.</li>
        </ul>
        <p className="mt-4">
          Công Ty Tin Học Phan Huyện hiểu rằng quyền lợi của bạn trong việc bảo
          vệ thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên trong
          bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến chính sách bảo
          mật của Công Ty Tin Học Phan Huyện, Hoặc khiếu nại của người tiêu dùng
          liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm
          vi đã thông báo vui lòng liên hệ qua số hotline{" "}
          <span className="font-bold">0838191191</span> hoặc email:
          tinhocphanhuyen@gmail.com
        </p>
      </div>
    </div>
  );
};

export default ChinhSachBaoMatThongTin;
