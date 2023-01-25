import React from "react";
import MainButton from "./MainButton";
import ModalComponent from "./Modal";
import ResponseMessage from "./ResponseMessage";

const UnenrollModal = ({
  onClose,
  show,
  raffleThreshold,
  unenrollUser,
  error,
  success,
}) => {
  return (
    <ModalComponent onClose={onClose} show={show}>
      <div className="flex flex-col p-[2rem]">
        <p className="font-vcr text-white text-center mb-[2rem]">
          Click Unenroll to unenroll raffle threshold of - {raffleThreshold}{" "}
          will be added to your $HP balance.
        </p>
        <div className="flex flex-col justify-center items-center w-full gap-[1rem]">
          <MainButton onClick={unenrollUser} ariaLabel="Enroll Button">
            Unenroll
          </MainButton>
        </div>
        <ResponseMessage error={error} success={success} />
      </div>
    </ModalComponent>
  );
};

export default UnenrollModal;
