import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import ResponseMessage from "./ResponseMessage";
import MainButton from "./MainButton";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const RaffleSection = ({
  enrollUser,
  unenrollUser,
  raffleThreshold,
  error,
  success,
}) => {
  let { user } = useContext(UserContext);
  const { address, isConnected } = useAccount();
  useEffect(() => {}, [error, success]);
  return (
    <>
      {user && user.nftCount > 0 && isConnected ? (
        <div
          className={`border border-1 border-slate-700 rounded flex gap-[1rem] flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.75rem]`}
        >
          <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem]">
            Raffle
          </h2>
          <p className="text-center font-vcr">
            Current raffle threshold:{" "}
            <span className="text-orange-400">{raffleThreshold}</span>
          </p>
          <p className="text-center font-vcr">
            Click the button below to ensure you are enrolled in the upcoming
            raffle.
          </p>
          <div className="w-full flex  flex-col gap-[1rem] justify-center items-center ">
            {user?.enrolled ? (
              <>
                <button
                  disabled={true}
                  className="px-[1.5rem] py-[.75rem] bg-slate-300 text-slate-800 text-vcr w-[80%] text-center font-vcr"
                >
                  You Are Enrolled!
                </button>

                <MainButton
                  onClick={() => unenrollUser()}
                  ariaLabel="Unenroll Button"
                  width="w-[80%]"
                >
                  Unenroll Now
                </MainButton>
              </>
            ) : (
              <MainButton
                onClick={async () => await enrollUser()}
                ariaLabel="Connect Wallet Button"
                width="w-[80%]"
              >
                Enroll Now
              </MainButton>
            )}
          </div>
          <ResponseMessage error={error} success={success} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default RaffleSection;
