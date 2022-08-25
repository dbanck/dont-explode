import React from "react";
import { ValidationRules, UseFormMethods } from "react-hook-form";

interface ITextField {
  register: UseFormMethods["register"];
  validationRules?: ValidationRules;
}

const TextField: React.FC<ITextField & React.HTMLProps<HTMLInputElement>> = ({
  register,
  validationRules,
  ...rest
}) => {
  return (
    <input
      ref={register(validationRules)}
      className="px-3 py-2 leading-none h-8 mr-2 border focus:outline-none border-gray-300 focus:border-gray-500 transition duration-200"
      {...rest}
    />
  );
};

export default TextField;
