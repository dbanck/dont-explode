import React from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#__next");

interface IModal {
  title: string;
}

// TODO? use tailwind instead?
const customStyles: ReactModal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: 0,
    maxWidth: "60vw",
    maxHeight: "40vh",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
};

// TODO: add shaking animation if click outside is not allowed

const Modal: React.FC<IModal & ReactModal.Props> = ({
  title,
  children,
  ...rest
}) => {
  return (
    <ReactModal {...rest} style={{ ...customStyles, ...rest.style }}>
      {rest.onRequestClose !== undefined && (
        <button
          onClick={rest.onRequestClose}
          className="absolute top-0 right-0 m-3 leading-4 text-gray-400 hover:text-gray-700 hover:rotate-180 transform  hover:scale-125 transition duration-200 focus:outline-none focus:text-gray-700"
        >
          ✕
        </button>
      )}
      <h2 className="mb-5 text-xl">{title}</h2>
      {children}
    </ReactModal>
  );
};

export default Modal;
