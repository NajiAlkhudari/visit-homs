


import React from "react";

function ButtonIcon({ icon: Icon, text, onClick, ariaLabel, className = "" }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center gap-2 p-2 rounded border bg-black text-white px-4 py-1 transform transition duration-300 hover:scale-110  ${className}`}
    >
      <Icon />
      <span>{text}</span>
    </button>
  );
}

export default ButtonIcon;
