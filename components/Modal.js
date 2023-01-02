import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { FaTimes } from "react-icons/fa";
import ReactDOM from "react-dom";

const Modal = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className="modal-overlay">
      <div className="bg-[#141414] w-[90%] md:w-[50%]  rounded p-[1.5rem] border border-1 border-slate-700 shadow-xl flex flex-col gap-[2rem]">
        <div className="flex justify-end text-[25px] h-[40px]">
          <a href="#" onClick={handleCloseClick}>
            <IconContext.Provider
              value={{
                color: "#FAFAFA",
                size: "1.5rem",
                className: "icons",
              }}
            >
              <FaTimes />
            </IconContext.Provider>
          </a>
        </div>
        {title && <h1>{title}</h1>}
        <div className="mb-[40px]">{children}</div>
      </div>{" "}
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
