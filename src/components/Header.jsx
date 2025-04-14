import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { FiMessageCircle, FiChevronDown } from "react-icons/fi";

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md relative z-50">
      {/* Brand */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        Skylearn
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-6">

        {/* Auth Links */}
        {!user && (
          <nav className="flex items-center gap-4 text-sm sm:text-base">
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/signup" className="hover:text-blue-300">Register</Link>
          </nav>
        )}

        {/* User Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:text-blue-300"
            >
              <span className="hidden sm:inline">
                Hi, {user.name || user.email?.split("@")[0]}
              </span>
              <FiChevronDown />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-gray-800 rounded-md shadow-md py-2">
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => setDropdownOpen(false)}
                >
                  Home
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
