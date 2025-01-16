import React, { useState, useEffect } from "react";
import nonAvata from '../../../../assets/img/nonAvata.jpg';
import {
  FiSearch,
  FiShoppingCart,
  FiShoppingBag,
  FiMail,
} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import NotificationIcon from "../../../Notification/NotificationIcon.jsx";
import { getCartItemsByUserId } from "../../../../hooks/Carts.js";
import logo from '../../../../assets/img/logo.png'
import io from 'socket.io-client'
import MessageIcon from "../../../Message/MessageIcon.jsx";

const socket = io("http://localhost:5555")

const Header = () => {
  const userInfoString = sessionStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const avatarUrl = (userInfo && userInfo.avatar_url) ? userInfo.avatar_url : nonAvata;
  const name = userInfo ? userInfo.name : "Guest!";
  const id = userInfo ? userInfo._id : null;
  const [nameProduct, setNamProduct] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [cartItemCount, setCartItemCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0); // State để lưu số lượng thông báo chưa đọc

  useEffect(() => {
    if (userInfo) {
      fetchCartItems(userInfo._id);
      socket.emit("sendMessage");
      socket.on('addToCart', () => {
        fetchCartItems(userInfo._id);
    });
    }
  },);

  const fetchCartItems = async (idUser) => {
    
      try {
        const response = await getCartItemsByUserId(idUser);
        setCartItemCount(response.length);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLinkClick = (path) => {
    if (userInfo) {
      navigate(path);
    } else {
      alert("Bạn chưa đăng nhập!");
    }
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userInfo');
    setUnreadCount(0); // Đặt lại số lượng thông báo chưa đọc về 0 khi đăng xuất
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (nameProduct.trim()) {
      setNamProduct('');
      navigate(`/search?name=${nameProduct}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/'); // Điều hướng về trang home
  };

  return (
    <>
      {/* Header Top */}
      <div className="bg-black text-white flex justify-center items-center p-2 space-x-4">
        <div className="text-sm">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        </div>
        <div className="tex-sm">
          <a href="'#" className="hover:underline">
            Shop Now
          </a>
        </div>
      </div>

      {/* Header Main */}
      <header className="bg-yellow-400 text-black justify-center flex items-center p-4 space-x-10">
        <div className="flex items-center">
        <div onClick={() => handleLogoClick()} className="cursor-pointer">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 rounded-full" // Kích thước 16 và bo tròn
          />
        </div>
          {/* <nav className="ml-6">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="flex items-center">
                  <FiMenu className="mr-2" />
                  Danh mục
                  <IoIosArrowForward className="ml-2" />
                </a>
              </li>
            </ul>
          </nav> */}
        </div>
        <div className="flex items-center bg-gray-100 rounded-md overflow-hidden w-[40vw]">
          <input
            type="text"
            placeholder="Sản phẩm cần tìm"
            value={nameProduct}
            onChange={(e) => setNamProduct(e.target.value)}
            className="bg-gray-100 p-2 w-full text-gray-700 focus:outline-none"
          />
          <button className="bg-yellow-400 p-2 text-black mr-1 rounded-full" onClick={handleSearchSubmit}>
            <FiSearch className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <span className="cursor-pointer" title="Thông báo">
            <NotificationIcon userId={id} />
          </span>
          <span className="cursor-pointer" title="Trò chuyện">
            <MessageIcon/>
          </span>
          <span className="relative cursor-pointer" onClick={() => navigate('/cart')} title="Giỏ hàng">
            <FiShoppingCart className="h-5 w-5" />
            {userInfo && cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1">
                {cartItemCount}
              </span>
            )}
          </span>
          <span
            onClick={() => {
                if (userInfo) {
                    navigate(`/order/${userInfo._id}`);
                } else {
                    alert("Bạn chưa đăng nhập!");
                }
            }}
            className="cursor-pointer"
            title="Đơn hàng"
        >
            <FiShoppingBag className="h-5 w-5" />
        </span>
          <span onClick={() => navigate('/feedback')} className="cursor-pointer" title="Đóng góp ý kiến">
            <FiMail  className="h-5 w-5" /> {/* Message icon */}
          </span>
          <span className="relative inline-block cursor-pointer" onClick={toggleDropdown}>
            <div className="flex items-center space-x-1 rounded-md hover:bg-gray-100 transition duration-200" title="Trang cá nhân">
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-10 h-10 object-cover rounded-full border-2 border-gray-300" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/50'; // Placeholder nếu có lỗi
                }}
              />
              <span className="font-semibold text-lg text-gray-800">{name}</span>
              <svg 
                className={`w-4 h-4 transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {dropdownOpen && (
              <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {userInfo ? (
                    <>
                      <button 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleLinkClick(`/profile/${userInfo._id}`)}>
                        Thông tin cá nhân
                      </button>
                      <button 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleLinkClick(`/post`)}>
                        Đăng tin bán hàng
                      </button>
                      <button 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => navigate(`/editSale/${userInfo._id}`)}>
                        Trang bán hàng
                      </button>
                      {userInfo.role === 'user' && (
                        <button 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleLinkClick(`/profile/${userInfo._id}`)}>
                          Đăng ký đối tác
                        </button>
                      )}
                      <button 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleLogout}>
                        Đăng xuất
                      </button>
                      <button 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleLinkClick(`/changepassword`)}>
                        Đổi mật khẩu
                      </button>
                    </>
                  ) : (
                    <>
                    <button 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => navigate('/login')}>
                      Đăng nhập
                    </button>
                    <button 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => navigate('/signup')}>
                      Đăng ký tài khoản
                    </button>
                    
                    </>
                  )}
                  <button 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => navigate('/regulations')}>
                      Quy định chung
                    </button>
                </div>
              </div>
            )}
          </span>
        </div>
      </header>

      <hr className="border-t border-gray-300 w-full" />
    </>
  );
};

export default Header;