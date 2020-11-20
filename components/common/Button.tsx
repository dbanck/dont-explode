import React from "react";

interface IButtonProps {
  clickHandler: () => void;
}

const Button: React.FC<IButtonProps> = ({ children, clickHandler }) => {
  return (
    <button
      onClick={clickHandler}
      className="bg-green-400 hover:bg-green-600 transition duration-200 transition-colors px-3 py-2 leading-4 text-white tracking-wide"
    >
      {children}
    </button>
  );
};

export default Button;
