import React from "react";
import { motion } from "framer-motion";
import { socialLinks } from "../../utils/socialLinks";
import { IconContext } from "react-icons";
import Link from "next/link";

const Navbar = ({ toggleModal }) => {
  return (
    <nav className="min-w-screen min-h-[60px] flex justify-between items-center px-[1rem] md:px-[1.5rem] border-b-[1px] border-slate-700">
      <Link href="/">
        <h3 className="font-pixel text-[#FAFAFA] cursor-pointer">HMDT</h3>
      </Link>
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
    </nav>
  );
};

export default Navbar;
