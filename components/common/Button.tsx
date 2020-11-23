import React from "react";

interface IButtonProps {
  type?: "button" | "submit" | "reset"; // fixes button type
}

const Button: React.FC<IButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  children,
  ...rest
}) => {
  return (
    <button
      className="h-8 ml-4 bg-green-400 hover:bg-green-600 transition duration-200 transition-colors px-3 py-2 leading-none text-white tracking-wide focus:outline-none focus:bg-green-600"
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
