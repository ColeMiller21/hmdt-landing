import React from "react";
import { motion } from "framer-motion";
import { socialLinks } from "../../utils/socialLinks";

const Footer = () => {
  return (
    <div className="min-w-screen h-[150px] flex flex-col items-center justify-center font-vcr px-[1rem] md:px-[1.5rem] border-t-[1px] border-slate-700 py-[1.5rem]">
      <h6 className="mb-[1rem]">@copyright HelpMeDebugThis 2023</h6>
      <ul className="flex flex-wrap justify-center px-[1.5rem] divide-x divide-white">
        {socialLinks.map((link, i) => {
          if (link.href) {
            return (
              <motion.li
                key={`${link.linkName}-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer px-[.75rem]"
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.linkName}
                >
                  {" "}
                  {link.linkName}
                </a>
              </motion.li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Footer;
