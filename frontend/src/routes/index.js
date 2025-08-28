import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import UserProfile from "../pages/UserProfile";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import CheckOut from "../pages/CheckOut";
import SearchPage from "../pages/SearchPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import OrderPage from "../pages/OrderPage";
import AllOrder from "../pages/AllOrder";
import GioiThieu from "../pages/GioiThieu";
import HuongDanMuaHang from "../pages/HuongDanMuaHang";
import MuaLaptopTraGop from "../pages/MuaLaptopTraGop";
import ChinhSachDoiTra from "../pages/ChinhSachDoiTra";
import ChinhSachBaoHanh from "../pages/ChinhSachBaoHanh";
import ChinhSachGiaoNhan from "../pages/ChinhSachGiaoNhan";
import ChinhSachBaoMatThongTin from "../pages/ChinhSachBaoMatThongTin";
import OrderStatistics from "../pages/OrderStatistics";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import SignupOtpVerification from "../pages/SignupOtpVerification";
import AllChats from "../pages/AllChat";
import LoginSuccess from "../pages/LoginSuccess";

// BƯỚC 1: IMPORT TRANG LIVE CHAT VÀO
import LiveChatDashboard from "../pages/admin/LiveChatDashboard";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "login/success",
          element: <LoginSuccess />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "signup-otp-verification",
          element: <SignupOtpVerification />,
        },
        {
          path: "product-category",
          element: <CategoryProduct />,
        },
        {
          path: "product-category/:categoryName",
          element: <CategoryProduct />,
        },
        {
          path: "product/:id",
          element: <ProductDetails />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "checkout",
          element: <CheckOut />,
        },
        {
          path: "success",
          element: <Success />,
        },
        {
          path: "cancel",
          element: <Cancel />,
        },
        {
          path: "order",
          element: <OrderPage />,
        },
        {
          path: "user/profile",
          element: <UserProfile />,
        },
        {
          path: "gioi-thieu",
          element: <GioiThieu />,
        },
        {
          path: "huong-dan-mua-hang",
          element: <HuongDanMuaHang />,
        },
        {
          path: "mua-laptop-tra-gop",
          element: <MuaLaptopTraGop />,
        },
        {
          path: "chinh-sach-doi-tra",
          element: <ChinhSachDoiTra />,
        },
        {
          path: "chinh-sach-bao-hanh",
          element: <ChinhSachBaoHanh />,
        },
        {
          path: "chinh-sach-giao-nhan",
          element: <ChinhSachGiaoNhan />,
        },
        {
          path: "chinh-sach-bao-mat-thong-tin",
          element: <ChinhSachBaoMatThongTin />,
        },
        {
          path: "verification-otp",
          element: <OtpVerification />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "admin-panel",
          element: <AdminPanel />,
          children: [
            {
              path: "all-users",
              element: <AllUsers />,
            },
            {
              path: "all-products",
              element: <AllProducts />,
            },
            {
              path: "all-orders",
              element: <AllOrder />,
            },
            {
              path: "all-chats",
              element: <AllChats />,
            },
            {
              path: "orders-statistics",
              element: <OrderStatistics />,
            },
            // BƯỚC 2: THÊM CON ĐƯỜNG MỚI VÀO ĐÂY
            {
              path: "live-chat",
              element: <LiveChatDashboard />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
