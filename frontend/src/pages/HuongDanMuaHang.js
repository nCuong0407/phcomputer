import React from "react";

const HuongDanMuaHang = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-[calc(100vh - 250px)]">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        HƯỚNG DẪN MUA HÀNG TẠI CÔNG TY TIN HỌC PHAN HUYỆN
      </h1>
      <div className="prose max-w-none text-gray-700">
        <p>
          Để giúp quý khách hàng có trải nghiệm mua sắm thuận tiện và dễ dàng
          nhất, Công Ty Tin học Phan Huyện xin gửi đến bạn hướng dẫn chi tiết
          các bước mua hàng:
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">
          CÁCH 1: GỌI ĐIỆN THOẠI
        </h2>
        <p>
          Gọi điện thoại đến hotline{" "}
          <span className="font-bold text-blue-600">0838191191</span> từ 8h00 –
          20h (cả T7 & CN) để đặt hàng, nhân viên chúng tôi luôn sẵn phục vụ, tư
          vấn và hỗ trợ quý khách mua được sản phẩm ưng ý.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">
          CÁCH 2: ĐẶT MUA HÀNG ONLINE TRÊN WEBSITE CongTyTinHocPhanHuyen.COM
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Bước 1: Tìm sản phẩm mua
        </h3>
        <p>
          Bạn có thể truy cập website CongTyTinHocPhanHuyen.com để tìm và chọn
          sản phẩm muốn mua bằng nhiều cách:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            Sử dụng ô tìm kiếm phía trên, gõ tên sản phẩm Laptop muốn mua (có
            thể tìm đích danh 1 sản phẩm, tìm theo hãng...). Website sẽ cung cấp
            cho bạn những gợi ý chính xác để lựa chọn.
          </li>
          <li>
            Sử dụng menu sản phẩm của website: chọn loại Laptop muốn mua là
            Dell, HP, Thinkpad, Asus, Lenovo,... hoặc chọn theo nhu cầu, cấu
            hình sử dụng.
          </li>
          <li>
            Sau đó tùy vào nhu cầu mua, bạn có thể lọc các sản phẩm theo tiêu
            chí về giá, lọc sản phẩm theo hãng, lọc theo nhu cầu sử dụng.
          </li>
        </ul>
        <div className="my-6 flex justify-center">
          <img
            src="/placeholder.svg?height=300&width=800"
            alt="Tìm kiếm và lọc sản phẩm"
            className="rounded-lg shadow-md"
          />
        </div>
        <p>
          Trang web luôn có sẵn những gợi ý sản phẩm hot nhất trong tuần, có
          chương trình khuyến mãi hấp dẫn, bạn cũng có thể chọn xem ngay tại
          trang chủ mà không cần tìm kiếm.
        </p>
        <div className="my-6 flex justify-center">
          <img
            src="/placeholder.svg?height=300&width=800"
            alt="Sản phẩm nổi bật"
            className="rounded-lg shadow-md"
          />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Bước 2: Đặt mua sản phẩm
        </h3>
        <p>
          Sau khi chọn được sản phẩm ưng ý muốn mua, bạn tiến hành đặt hàng bằng
          cách:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            Chọn vào nút{" "}
            <span className="font-bold text-blue-600">MUA NGAY</span> nếu bạn
            muốn thanh toán luôn toàn bộ giá tiền sản phẩm, chọn vào nút{" "}
            <span className="font-bold text-blue-600">MUA TRẢ GÓP</span> nếu bạn
            muốn mua theo hình thức trả góp.
          </li>
        </ul>
        <div className="my-6 flex justify-center">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="Trang chi tiết sản phẩm"
            className="rounded-lg shadow-md"
          />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Bước 3: Điền thông tin mua hàng và Thanh toán
        </h3>
        <p>
          Điền đầy đủ các thông tin mua hàng theo các bước trên website, sau đó
          chọn hình thức nhận hàng là giao hàng tận nơi hay đến shop lấy hàng,
          chọn hình thức thanh toán là trả khi nhận hàng COD hay thanh toán
          online (bằng thẻ ATM, VISA hay MasterCard) và hoàn tất đặt hàng.
        </p>
        <div className="my-6 flex justify-center">
          <img
            src="/placeholder.svg?height=500&width=700"
            alt="Form thông tin thanh toán"
            className="rounded-lg shadow-md"
          />
        </div>
        <p>
          Ngoài ra, nếu quý khách đang sở hữu phiếu mua hàng, mã giảm giá... thì
          hãy nhập trong bước đặt hàng để được giảm giá theo các bước tại hướng
          dẫn. Cách sử dụng phiếu mua hàng.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">
          Đăng ký mua trả góp
        </h3>
        <p>
          Nếu bạn chọn hình thức mua trả góp, bạn sẽ được hướng dẫn điền thông
          tin chi tiết cho việc đăng ký trả góp.
        </p>
        <div className="my-6 flex justify-center">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="Form đăng ký trả góp"
            className="rounded-lg shadow-md"
          />
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600">
          LƯU Ý QUAN TRỌNG
        </h2>
        <ol className="list-decimal list-inside ml-4">
          <li>
            Chúng tôi chỉ chấp nhận những đơn đặt hàng khi cung cấp đủ thông tin
            chính xác về địa chỉ, số điện thoại. Sau khi bạn đặt hàng, chúng tôi
            sẽ liên lạc lại để kiểm tra thông tin và thỏa thuận thêm những điều
            có liên quan.
          </li>
          <li>
            Một số trường hợp nhạy cảm: giá trị đơn hàng quá lớn & thời gian
            giao hàng vào buổi tối địa chỉ giao hàng trong ngõ hoặc có thể dẫn
            đến nguy hiểm. Chúng tôi sẽ chủ động liên lạc với quý khách để thống
            nhất lại thời gian giao hàng cụ thể.
          </li>
          <li>
            Công ty cam kết tất cả Laptop gửi đến quý khách đều là Laptop nhập
            chuẩn, đã kiểm tra kỹ (có đầy đủ hóa đơn, được bảo hành chính thức).
            Những rủi ro phát sinh trong quá trình vận chuyển (va đập, ẩm ướt,
            tai nạn...) có thể ảnh hưởng đến hàng hóa, vì xin Quý Khách vui lòng
            kiểm tra hàng hóa thật kỹ trước khi ký nhận. Máy Xấu Giá Cao sẽ
            không chịu trách nhiệm với những sai lệch hình thức của hàng hóa sau
            khi Quý Khách đã ký nhận.
          </li>
        </ol>

        <p className="mt-8">
          Sau khi đặt hàng thành công, Công Ty Tin học Phan Huyện sẽ liên hệ quý
          khách để xác nhận và hoàn tất thủ tục.
        </p>
        <p className="mt-4">
          Ngoài các cách trên, để mua hàng tại Công Ty Tin học Phan Huyện quý
          khách còn có thể để lại bình luận tại bất kì đâu trên website (có
          thông tin tên, số điện thoại...), hoặc trực tiếp chat với tư vấn viên
          của công ty để được tư vấn và đặt mua sản phẩm.
        </p>
      </div>
    </div>
  );
};

export default HuongDanMuaHang;
