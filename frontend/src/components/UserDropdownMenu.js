import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';

const UserDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.user);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include'
      });

      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message || "Đăng xuất thành công");
        dispatch(setUserDetails(null));
        navigate('/');
      } else {
        toast.error(data.message || "Lỗi khi đăng xuất");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Lỗi khi đăng xuất");
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-700">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.role}</div>
        </div>
        <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
                <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/user-profile"
              onClick={handleMenuClick}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <FaUser className="mr-3 text-gray-400" />
              Thông tin người dùng
            </Link>

            {/* Chỉ hiển thị cho Admin */}
            {user?.role === ROLE.ADMIN && (
              <Link
                to="/admin-panel/all-users"
                onClick={handleMenuClick}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                <FaUsers className="mr-3 text-gray-400" />
                Quản lý người dùng
              </Link>
            )}

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <FaSignOutAlt className="mr-3 text-red-400" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdownMenu;