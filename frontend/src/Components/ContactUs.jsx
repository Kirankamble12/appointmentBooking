import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const ContactUs = () => {
  return (
    <div className="w-full max-w-[95%] sm:max-w-[98%] lg:max-w-[80%] mx-auto p-4 bg-white shadow-xl shadow-violet-400 rounded-lg text-center">
      <h2 className="text-2xl font-bold text-violet-700">Contact Us</h2>
      <p className="text-gray-600 mb-3 text-sm">Reach out to us anytime—we're here to help!</p>

      {/* Contact Details */}
      <div className="space-y-2 text-md text-gray-700">
        <div className="flex items-center justify-center gap-2 bg-violet-100 p-2 rounded-lg">
          <FaMapMarkerAlt className="text-violet-700" /> <strong>Address:</strong> 123 EduBook Lane, Learning City, IN 400001
        </div>
        <div className="flex items-center justify-center gap-2 bg-violet-100 p-2 rounded-lg">
          <FaPhoneAlt className="text-violet-700" /> <strong>Phone:</strong> +91 98765 43210
        </div>
        <div className="flex items-center justify-center gap-2 bg-violet-100 p-2 rounded-lg">
          <FaEnvelope className="text-violet-700" /> <strong>Email:</strong> support@edubook.com
        </div>
        <div className="flex items-center justify-center gap-2 bg-violet-100 p-2 rounded-lg">
          <FaClock className="text-violet-700" /> <strong>Working Hours:</strong> Mon - Fri, 9 AM - 6 PM IST
        </div>
      </div>

      {/* Social Media Icons Only */}
      <div className="flex justify-center space-x-3 mt-4">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="bg-violet-700 text-white p-2 rounded-full hover:bg-violet-800 transition-all text-lg">
          <FaFacebookF />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="bg-violet-700 text-white p-2 rounded-full hover:bg-violet-800 transition-all text-lg">
          <FaTwitter />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="bg-violet-700 text-white p-2 rounded-full hover:bg-violet-800 transition-all text-lg">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-violet-700 text-white p-2 rounded-full hover:bg-violet-800 transition-all text-lg">
          <FaLinkedinIn />
        </a>
      </div>
    </div>
  );
};
