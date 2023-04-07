import React from "react";
import { motion } from "framer-motion";

const MainButton = ({
  children,
  onClick,
  ariaLabel,
  width,
  ...buttonProps
}) => {
  return (
    <motion.button
      {...buttonProps}
      type="button"
      aria-label={ariaLabel}
      whileHover={{ scale: buttonProps.disabled ? 1 : 1.02 }}
      whileTap={{ scale: buttonProps.disabled ? 1 : 0.98 }}
      className={`px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr ${
        width ? width : "w-[70%] md:w-[40%] "
      } ${buttonProps.disabled && "cursor-not-allowed"} 
      text-center font-vcr ${!buttonProps.disabled && "hover:bg-slate-600"}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default MainButton;
