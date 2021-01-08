import React from "react";

const Wrapper: React.FC = ({ children }) => {
  return <div className="flex flex-col h-screen">{children}</div>;
};

export default Wrapper;
