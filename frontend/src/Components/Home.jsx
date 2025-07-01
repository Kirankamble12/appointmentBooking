import React from "react";
import HomeImg from "../assets/images/home.jpg";

export default function Home() {
  return (
    <div className="relative w-full px-2 py-2">
      {/* Background Image */}
      <img
        src={HomeImg}
        alt="home"
        className="w-full h-[50vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] object-cover rounded-lg"
      />

      {/* White Transparent Overlay */}
      <div className="absolute inset-0 bg-white opacity-30 rounded-lg"></div>

    
      {/* Overlay Content */}
<div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-12 w-full">
  <div className="bg-black bg-opacity-10 p-4 sm:p-6 md:p-8 rounded-[50px] text-center w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl shadow-lg">
    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
      Welcome to EduBook
    </h1>
    <p className="text-sm sm:text-md md:text-lg lg:text-xl mt-2 text-white">
      Your platform for seamless Student-Teacher appointments.
    </p>
  </div>
</div>

    </div>
  );
}
