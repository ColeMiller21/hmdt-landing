import { IconContext } from "react-icons";
import ReactDOM from "react-dom";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

const ModalComponent = ({ show, onClose, children, title }) => {
  const [isMobile, setIsMobile] = useState(false);
  const appWidth = () => {
    if (window.innerWidth <= 1127) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    return window.innerWidth;
  };

  useEffect(() => {
    window.addEventListener("resize", appWidth);
    appWidth();
  }, []);

  return (
    <Modal
      show={show}
      onHide={onClose}
      size={isMobile ? "md" : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body style={{ backgroundColor: "#141515" }}>
        <div className="flex w-full justify-end">
          <button className="text-2xl" onClick={onClose}>
            <IconContext.Provider
              value={{
                color: "#FAFAFA",
                size: "1.5rem",
                className: "icons",
              }}
            >
              <FaTimes />
            </IconContext.Provider>
          </button>
        </div>
        {title && <h1>{title}</h1>}
        <div className="mb-[40px]">{children}</div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
