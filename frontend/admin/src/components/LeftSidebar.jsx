import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaHandshake,
  FaComments,
  FaListAlt,
  FaBell,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const LeftSidebar = () => {
  const [activeLink, setActiveLink] = useState(""); // default active link
  const { logout } = useAuth();

  // Function to handle active link
  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link); // Save active link to localStorage
  };

  // Load active link from URL or localStorage when the component mounts
  useEffect(() => {
    const savedLink = localStorage.getItem("activeLink");
    const currentPath = window.location.pathname; // Get current path
    setActiveLink(savedLink || currentPath);
  }, []);

  return (
    <div className="w-64 bg-white text-blue-500 h-full flex flex-col">
      <div className="flex items-center justify-center">
        <img
          src="../../public/images/logo.png"
          alt="Logo"
          className="h-13 max-w-[10em]"
        />
      </div>

      <div className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              onClick={() => handleLinkClick("/")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/" ? "bg-blue-500 text-white" : "text-gray-500"
              }`}
            >
              <FaTachometerAlt className="mr-2" /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              onClick={() => handleLinkClick("/admin/users")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/users"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaUsers className="mr-2" /> Users Account
            </Link>
          </li>
          <li>
            <Link
              to="/admin/posts"
              onClick={() => handleLinkClick("/admin/posts")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/posts"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaBoxOpen className="mr-2" /> Product Posts
            </Link>
          </li>
          <li>
            <Link
              to="/admin/partner"
              onClick={() => handleLinkClick("/admin/partner")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/partner"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaHandshake className="mr-2" /> Partner
            </Link>
          </li>
          <li>
            <Link
              to="/admin/feedbacks"
              onClick={() => handleLinkClick("/admin/feedbacks")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/feedbacks"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaComments className="mr-2" /> Customer Feedbacks
            </Link>
          </li>
          <li>
            <Link
              to="/admin/category"
              onClick={() => handleLinkClick("/admin/category")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/category"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaListAlt className="mr-2" /> Category Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/order"
              onClick={() => handleLinkClick("/admin/order")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/order"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaListAlt className="mr-2" /> Order Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/notifications"
              onClick={() => handleLinkClick("/admin/notifications")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/notifications"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaBell className="mr-2" /> Notifications
            </Link>
          </li>
          <li>
            <Link
              to="/admin/regulation"
              onClick={() => handleLinkClick("/admin/regulation")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/regulation"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaListAlt className="mr-2" /> Regulation Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/review"
              onClick={() => handleLinkClick("/admin/review")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/review"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <FaListAlt className="mr-2" /> Review Management
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                const confirmLogout = window.confirm(
                  "Are you sure you want to log out?"
                );
                if (confirmLogout) {
                  logout();
                }
              }}
              className="flex items-center text-sm p-2 rounded text-gray-500 hover:bg-red-500 hover:text-white"
            >
              <FaSignOutAlt className="mr-2" /> Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
