import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-violet-600 text-white shadow-2xl p-3 rounded-lg mx-2 my-2 relative z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold">EduBook</div>

        {/* Hamburger */}
        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Links */}
        <ul className="hidden sm:flex space-x-10 items-center">
          <li><Link to="/" className="hover:bg-violet-700 p-2 rounded-md">Home</Link></li>
          <li><Link to="/contactus" className="hover:bg-violet-700 p-2 rounded-md">Contact Us</Link></li>

          {/* Desktop Login Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-violet-700 text-white p-2 rounded-md hover:bg-violet-800 transition-all"
            >
              Login
            </button>

            {isDropdownOpen && (
              <div className="absolute left-1/2 transform -translate-x-3/4 mt-4 w-48 bg-white text-black shadow-lg rounded-lg p-3 z-[100]">
                <Link to="/admin-login" className="block p-3 hover:bg-violet-100 rounded-t-lg">Admin Login</Link>
                <Link to="/teacher-login" className="block p-3 hover:bg-violet-100">Teacher Login</Link>
                <Link to="/student-login" className="block p-3 hover:bg-violet-100 rounded-b-lg">Student Login</Link>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-violet-700 p-4 mt-2 space-y-4 rounded-lg shadow-lg z-[100] text-white">
          <li><Link to="/" className="block p-2 rounded-md active:bg-violet-800" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/contactus" className="block p-2 rounded-md active:bg-violet-800" onClick={() => setIsOpen(false)}>Contact Us</Link></li>

          {/* Mobile Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-violet-700 text-white p-2 rounded-md hover:bg-violet-800 w-full text-left">
              Login
            </button>

            {isDropdownOpen && (
              <div className="bg-white text-black shadow-lg mt-4 rounded-lg p-3 z-[100]">
                <Link to="/admin-login" className="block p-3 hover:bg-violet-100 rounded-t-lg"
                  onClick={() => { setIsDropdownOpen(false); setIsOpen(false); }}>Admin Login</Link>
                <Link to="/teacher-login" className="block p-3 hover:bg-violet-100"
                  onClick={() => { setIsDropdownOpen(false); setIsOpen(false); }}>Teacher Login</Link>
                <Link to="/student-login" className="block p-3 hover:bg-violet-100 rounded-b-lg"
                  onClick={() => { setIsDropdownOpen(false); setIsOpen(false); }}>Student Login</Link>
              </div>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;