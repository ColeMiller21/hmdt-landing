import React from "react";
import { motion } from "framer-motion";
import { socialLinks } from "../../utils/socialLinks";

const Footer = () => {
  return (
    <div className="min-w-screen min-h-[75px] flex flex-col items-center font-vcr p-[1.5rem] border-t-[1px] border-slate-700 py-[1.5rem]">
      <h6 className="my-[1rem]">
        HMDT <span>&copy;</span>Copyright 2023
      </h6>
      <ul className="flex flex-wrap justify-center px-[1.5rem] divide-x divide-white">
        {socialLinks.map((link, i) => {
          return (
            <motion.li
              key={`${link.linkName}-${i}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer px-[.75rem]"
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {" "}
                {link.linkName}
              </a>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default Footer;
