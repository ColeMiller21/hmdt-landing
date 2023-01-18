import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ResponseMessage from "./ResponseMessage";

const UserActionSection = ({ user, submitBid }) => {
  const [bidAmount, setBidAmount] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const userSubmit = async (e) => {
    e.preventDefault();
    let { success, message } = await submitBid(bidAmount);
    if (!success) {
      setErrorText(message);
      setTimeout(() => {
        setErrorText(null);
      }, 2500);
      return;
    }
    setSuccessText(message);
    setBidAmount(0);
    setTimeout(() => {
      setSuccessText(null);
    }, 2500);
  };

  return (
    <>
      {user && user?.nftCount > 0 ? (
        <div className="flex flex-col w-full lg:gap-[1.5rem]">
          <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem]">
            Bidding
          </h2>
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center ">
            <div className="font-vcr">
              <h6 className="mt-[1rem] lg:mt-0">
                Balance of $HP: {user?.totalBalance || 0}
              </h6>
              <h6>Current Bid: {user?.bidAmount || "N/A"}</h6>
            </div>
            <ConnectButton showBalance={false} chainStatus="none" />
          </div>
          <div className="flex flex-col items-center gap-[1rem] py-[1rem]">
            <input
              type="number"
              placeholder="Place Bid"
              className="h-[45px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
              onChange={(e) => setBidAmount(e.target.value)}
              value={bidAmount}
            />
            <motion.button
              type="submit"
              aria-label="Place Bid"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[80%] text-center font-vcr"
              onClick={userSubmit}
              disabled={!user}
            >
              Submit Bid
            </motion.button>
            <ResponseMessage error={errorText} success={successText} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full lg:gap-[1.5rem] items-center text-center">
          <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem]">
            No Account
          </h2>
          <p className="font-vcr my-[1rem]">
            The wallet you are using is not associated with a wallet holding a
            HMDT. Please try a different wallet or purchase a HMDT!
          </p>
          <motion.a
            href="https://opensea.io/collection/helpmedebugthis"
            target="_blank"
            rel="noopener noreferrer"
            className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] text-center font-vcr"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go To OpenSea
          </motion.a>
        </div>
      )}
    </>
  );
};

export default UserActionSection;
