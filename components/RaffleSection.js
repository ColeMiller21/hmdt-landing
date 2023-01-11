import React from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

const RaffleSection = ({ user, enrollUser }) => {
  const { address, isConnected } = useAccount();
  return (
    <>
      {user && isConnected ? (
        <div
          className={`border border-1 border-slate-700 rounded flex gap-[1rem] flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.75rem]`}
        >
          <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center">
            Raffle
          </h2>
          <p className="text-center font-vcr">
            Click the button below to ensure you are enrolled in the upcoming
            raffle.
          </p>
          <div className="w-full flex justify-center items-center ">
            {user?.enrolled ? (
              <button
                disabled={true}
                className="px-[1.5rem] py-[.75rem] bg-slate-300 text-slate-800 text-vcr w-[70%] text-center font-vcr"
              >
                You Are Enrolled!
              </button>
            ) : (
              <motion.button
                type="button"
                aria-label="Connect Wallet Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] text-center font-vcr"
                onClick={async () => await enrollUser()}
              >
                Enroll Now
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default RaffleSection;
