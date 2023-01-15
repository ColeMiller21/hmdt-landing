import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import ResponseMessage from "./ResponseMessage";

const RaffleSection = ({
  user,
  enrollUser,
  raffleThreshold,
  error,
  success,
}) => {
  const { address, isConnected } = useAccount();
  useEffect(() => {}, [error, success]);
  return (
    <>
      {user && isConnected ? (
        <div
          className={`border border-1 border-slate-700 rounded flex gap-[1rem] flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.75rem]`}
        >
          <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem]">
            Raffle
          </h2>
          <p className="text-center font-vcr">
            Current raffle threshold: {raffleThreshold}
          </p>
          <p className="text-center font-vcr">
            Click the button below to ensure you are enrolled in the upcoming
            raffle.
          </p>
          <div className="w-full flex justify-center items-center ">
            {user?.enrolled ? (
              <button
                disabled={true}
                className="px-[1.5rem] py-[.75rem] bg-slate-300 text-slate-800 text-vcr w-[80%] text-center font-vcr"
              >
                You Are Enrolled!
              </button>
            ) : (
              <motion.button
                type="button"
                aria-label="Connect Wallet Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[80%] text-center font-vcr"
                onClick={async () => await enrollUser()}
              >
                Enroll Now
              </motion.button>
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
