import React from "react";
import { motion } from "framer-motion";

const NoAccount = () => {
  return (
    <div className="flex flex-col w-full lg:gap-[1.5rem] items-center text-center">
      <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem]">
        No Account
      </h2>
      <p className="font-vcr my-[1rem]">
        The wallet you are using is not associated with a wallet holding a HMDT.
        Please try a different wallet or purchase a HMDT!
      </p>
      <motion.a
        href="https://opensea.io/collection/helpmedebugthis"
        target="_blank"
        rel="noopener noreferrer"
        className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr hover:bg-slate-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Go To OpenSea
      </motion.a>
    </div>
  );
};

export default NoAccount;
