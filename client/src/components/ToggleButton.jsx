import React from "react";

const ToggleButton = ({ isOn, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-12 h-6 flex items-center px-1 rounded-full cursor-pointer transition-colors duration-300 ${
        isOn ? "bg-black" : "bg-gray-400"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </div>
  );
};

export default ToggleButton;
