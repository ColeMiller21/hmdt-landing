import React from "react";
import { motion } from "framer-motion";

const MainButton = ({ children, onClick, ariaLabel, width }) => {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr ${
        width ? width : "w-[70%] md:w-[40%] "
      } text-center font-vcr hover:bg-slate-600`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default MainButton;
