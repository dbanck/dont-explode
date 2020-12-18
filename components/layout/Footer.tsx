import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="px-4 py-2 bg-gray-300 flex-0 text-xs flex items-center justify-between">
      <div>
        heavily inspired by the original <em>Exploding kittens</em>
      </div>
      <div>
        made with <span className="text-red-600 text-lg px-1">&#9829;</span> by
        Basti & Daniel
      </div>
    </footer>
  );
};

export default Footer;
