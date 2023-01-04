import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const UserActionSection = () => {
  const { address, isConnected } = useAccount();

  const [hpBalance, setHpBalance] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);

  const submitBid = () => {
    console.log(bidAmount);
  };

  const onEnterPressed = () => {};

  return (
    <div className="flex flex-col w-full lg:gap-[1.5rem]">
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center ">
        <div className="font-vcr">
          <h6 className="mt-[1rem] lg:mt-0">Balance of $HP: {hpBalance}</h6>
          <h6>Current Bid: N/A</h6>
        </div>
        <ConnectButton />
      </div>
      <div className="flex flex-col items-center gap-[1rem] py-[1rem]">
        <input
          type="number"
          placeholder="Place Bid"
          className="h-[45px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
          onChange={(e) => setBidAmount(e.target.value)}
          onKeyUp={(e) => onEnterPressed(e)}
          value={bidAmount}
        />
        <motion.button
          type="submit"
          aria-label="Place Bid"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] text-center font-vcr"
          onClick={submitBid()}
        >
          Submit Bid
        </motion.button>
      </div>
    </div>
  );
};

export default UserActionSection;
