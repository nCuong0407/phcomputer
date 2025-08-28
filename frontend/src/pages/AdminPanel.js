import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // SỬA: Dùng NavLink thay cho Link
import ROLE from "../common/role";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    // SỬA: Thêm điều kiện chờ user được load xong để không bị đá về trang chủ oan
    if (user === null) {
      return;
    }
    if (user.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  // Style cho NavLink khi được chọn
  const activeLinkStyle =
    "bg-slate-200 px-2 py-1 text-blue-600 font-bold rounded";
  const defaultLinkStyle = "px-2 py-1 hover:bg-slate-100 rounded";

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex hidden">
      <aside className="bg-white min-h-full w-full max-w-60 customShadow pt-4">
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-20 h-20 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/**navigation**/}
        <div>
          {/* SỬA LẠI TOÀN BỘ NAV NÀY ĐỂ DÙNG NAVLINK */}
          <nav className="grid p-4 gap-1">
            <NavLink
              to={"all-users"}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : defaultLinkStyle
              }
            >
              Quản Lý Người Dùng
            </NavLink>
            <NavLink
              to={"all-products"}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : defaultLinkStyle
              }
            >
              Quản Lý Sản Phẩm
            </NavLink>
            <NavLink
              to={"all-orders"}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : defaultLinkStyle
              }
            >
              Quản Lý Đơn Hàng
            </NavLink>
            <NavLink
              to={"all-chats"}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : defaultLinkStyle
              }
            >
              Quản Lý Đoạn Chat
            </NavLink>
            {/* THÊM NÚT MỚI Ở ĐÂY */}
            <NavLink
              to={"live-chat"}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : defaultLinkStyle
              }
            >
              Quản Lý Tin Nhắn
            </NavLink>
            <NavLink
              to={"orders-statistics"}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : defaultLinkStyle
              }
            >
              Quản Lý Thống Kê
            </NavLink>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
