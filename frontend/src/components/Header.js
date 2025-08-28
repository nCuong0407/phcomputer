import React, { useState, useContext } from "react";
import Context from "../context";
import Logo from "./Logo";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import NotificationWrapper from "./NotificationWrapper";
import SearchProduct from "./SearchProduct";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const { waitingCustomerCount } = useContext(Context); // Lấy số khách chờ từ Context

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      setMenuDisplay(false);
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  return (
    <header className="h-16 shadow-none bg-white sticky w-full z-40 top-0">
      <div className="h-full container mx-auto flex items-center px-4 justify-between relative">
        {/* Logo */}
        <div>
          <Link to={"/"}>
            <Logo w={100} h={100} />
          </Link>
        </div>

        {/* Thanh search */}
        <div className="flex-1 flex justify-center ">
          <SearchProduct />
        </div>

        {/* Cụm icon bên phải */}
        <div className="flex items-center gap-7">
          {user?._id && <NotificationWrapper />}

          {/* User menu */}
          <div className="relative flex justify-center">
            {user?._id && (
              <div
                className="text-3xl cursor-pointer relative flex justify-center"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic || "/placeholder.svg"}
                    className="w-10 h-10 rounded-full border-2 border-gray-600"
                    alt={user?.name}
                    onError={(e) => {
                      if (e?.target) {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg";
                      }
                    }}
                  />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className="absolute bg-white top-11 right-0 h-fit p-2 shadow-lg rounded min-w-max z-50">
                <nav className="flex flex-col gap-1">
                  <Link
                    to={"/user/profile"}
                    className="whitespace-nowrap hover:bg-slate-100 p-2 rounded"
                    onClick={() => setMenuDisplay(false)}
                  >
                    Thông tin người dùng
                  </Link>
                  {user?.role !== ROLE.ADMIN && (
                    <Link
                      to={"/order"}
                      className="whitespace-nowrap hover:bg-slate-100 p-2 rounded"
                      onClick={() => setMenuDisplay(false)}
                    >
                      Thông tin đơn hàng
                    </Link>
                  )}
                  {user?.role === ROLE.ADMIN && (
                    <>
                      <Link
                        to={"/admin-panel/all-products"}
                        className="whitespace-nowrap hover:bg-slate-100 p-2 rounded"
                        onClick={() => setMenuDisplay(false)}
                      >
                        Trang Admin
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* Cart */}
          {user?._id && (
            <Link to={"/cart"} className="text-2xl relative">
              <FaShoppingCart />
              <div className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-xs">{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          {/* Login / Logout */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                to={"/login"}
                className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
