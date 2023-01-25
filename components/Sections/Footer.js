import React from "react";
import { motion } from "framer-motion";
import { socialLinks } from "../../data/links/socialLinks";
import { IconContext } from "react-icons";

const Footer = ({ toggleModal }) => {
  return (
    <div className="min-w-screen min-h-[75px] flex flex-col items-center font-vcr px-[1rem] md:px-[1.5rem] border-t-[1px] border-slate-700 py-[1.5rem]">
      <h6 className="my-[1rem]">
        {/* HMDT <span>&copy;</span>Copyright 2023 */}
        ©HelpMeDebugThis 2023
      </h6>
      <ul className="flex gap-[0.75rem] font-pixel">
        <IconContext.Provider
          value={{
            color: "#FAFAFA",
            size: "1.5rem",
            className: "icons",
          }}
        >
          {socialLinks.map((link, i) => {
            if (link.type === "social") {
              return (
                <motion.li
                  key={`${link.linkName}-${i}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="max-h-[1.5rem] max-w-[1.5rem] cursor-pointer"
                >
                  {link.href ? (
                    <a
                      aria-label={link.linkName}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.icon}
                    </a>
                  ) : (
                    <span onClick={toggleModal}>{link.icon}</span>
                  )}
                </motion.li>
              );
            }
          })}
        </IconContext.Provider>
      </ul>
    </div>
  );
};

export default Footer;
