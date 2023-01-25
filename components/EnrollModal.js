import React from "react";
import MainButton from "./MainButton";
import ModalComponent from "./Modal";
import ResponseMessage from "./ResponseMessage";

const EnrollModal = ({
  onClose,
  show,
  message,
  error,
  success,
  enrollUser,
}) => {
  return (
    <ModalComponent onClose={onClose} show={show}>
      <div className="flex flex-col p-[2rem]">
        <p className="font-vcr text-white text-center mb-[2rem]">{message}</p>
        <div className="flex flex-col justify-center items-center w-full gap-[1rem]">
          <MainButton onClick={enrollUser} ariaLabel="Enroll Button">
            Enroll
          </MainButton>
          <MainButton onClick={onClose} ariaLabel="Cancel Button">
            Cancel
          </MainButton>
        </div>
        <ResponseMessage error={error} success={success} />
      </div>
    </ModalComponent>
  );
};

export default EnrollModal;
