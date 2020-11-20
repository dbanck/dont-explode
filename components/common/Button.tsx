import React from "react";

interface IButtonProps {
  clickHandler?: () => void;

  type?: "button" | "submit" | "reset"; // fixes button type
}

const Button: React.FC<IButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  children,
  clickHandler,
  ...rest
}) => {
  return (
    <button
      onClick={clickHandler}
      className="h-8 bg-green-400 hover:bg-green-600 transition duration-200 transition-colors px-3 py-2 leading-none text-white tracking-wide focus:outline-none focus:bg-green-600"
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
