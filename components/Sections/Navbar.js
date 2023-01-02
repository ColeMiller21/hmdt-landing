import React from "react";
import { motion } from "framer-motion";
import { socialLinks } from "../../utils/socialLinks";
import { IconContext } from "react-icons";

const Navbar = () => {
  return (
    <nav className="min-w-screen min-h-[60px] flex justify-between items-center px-[1.5rem] border-b-[1px] border-slate-700">
      <div>
        <h3 className="font-pixel">HMDT</h3>
      </div>
      <ul className="flex gap-[0.75rem] font-pixel">
        <IconContext.Provider
          value={{
            color: "#FAFAFA",
            size: "1.5rem",
            className: "icons",
          }}
        >
          {socialLinks.map((link, i) => {
            return (
              <motion.li
                key={`${link.linkName}-${i}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="max-h-[1.5rem] max-w-[1.5rem] cursor-pointer"
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.icon}
                </a>
              </motion.li>
            );
          })}
        </IconContext.Provider>
      </ul>
    </nav>
  );
};

export default Navbar;
