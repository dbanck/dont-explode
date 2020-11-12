import React from "react";

interface IButtonProps {
  clickHandler: () => void;
}

const Button: React.FC<IButtonProps> = ({ children, clickHandler }) => {
  return (
    <button
      onClick={clickHandler}
      className="bg-green-400 hover:bg-green-600 transition duration-200 transition-colors px-2 py-1 text-white tracking-wide"
    >
      {children}
    </button>
  );
};

export default Button;
