import React from "react";

const Main: React.FC = ({ children }) => {
  return (
    <div className="flex flex-1 flex-col bg-blue-900 overflow-hidden items-center justify-center">
      {children}
    </div>
  );
};

export default Main;
