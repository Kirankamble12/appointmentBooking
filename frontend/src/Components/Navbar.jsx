import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-violet-600 text-white shadow-2xl p-3 rounded-lg mx-2 my-2 transition-all duration-300 relative z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold">EduBook</div>

        {/* Hamburger Menu (Mobile) */}
        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Links */}
        <ul className="hidden sm:flex space-x-10 items-center">
          <li><Link to="/" className="hover:bg-violet-700 p-2 rounded-md">Home</Link></li>
          <li><Link to="/contactus" className="hover:bg-violet-700 p-2 rounded-md">Contact Us</Link></li>

          {/* Login Dropdown */}
          <li className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="bg-violet-700 text-white p-2 rounded-md hover:bg-violet-800 transition-all"
            >
              Login
            </button>

            {isDropdownOpen && (
              <div className="absolute left-1/2 transform -translate-x-3/4 mt-4 w-48 bg-white shadow-lg rounded-lg text-black p-3 z-50">
                <Link to="/admin-login" className="block p-3 hover:bg-violet-100 rounded-t-lg transition-all"
                  onClick={() => setIsDropdownOpen(false)}>Admin Login</Link>
                <Link to="/teacher-login" className="block p-3 hover:bg-violet-100 transition-all"
                  onClick={() => setIsDropdownOpen(false)}>Teacher Login</Link>
                <Link to="/student-login" className="block p-3 hover:bg-violet-100 rounded-b-lg transition-all"
                  onClick={() => setIsDropdownOpen(false)}>Student Login</Link>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Menu (Displayed When Open) */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-violet-700 p-4 mt-2 space-y-4 rounded-lg shadow-lg z-50">
          <li><Link to="/" className="active:bg-violet-800 p-2 rounded-md transition-all block" onClick={() => setIsOpen(false)}>Home</Link></li> <hr/>
          <li><Link to="/contactus" className="active:bg-violet-800 p-2 rounded-md transition-all block" onClick={() => setIsOpen(false)}>Contact Us</Link></li> <hr/>

          {/* Mobile Login Dropdown */}
          <li className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-violet-700 text-white p-2 rounded-md hover:bg-violet-800 transition-all w-full text-left">
              Login
            </button>

            {isDropdownOpen && (
              <div className="bg-white shadow-lg mt-4 rounded-lg p-3 z-50">
                <Link to="/admin-login" className="block p-3 hover:bg-violet-100 rounded-t-lg transition-all"
                  onClick={() => { setIsDropdownOpen(false); setIsOpen(false); }}>Admin Login</Link>
                <Link to="/teacher-login" className="block p-3 hover:bg-violet-100 transition-all"
                  onClick={() => { setIsDropdownOpen(false); setIsOpen(false); }}>Teacher Login</Link>
                <Link to="/student-login" className="block p-3 hover:bg-violet-100 rounded-b-lg transition-all"
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
