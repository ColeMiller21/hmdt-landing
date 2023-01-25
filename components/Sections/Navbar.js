import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconContext } from "react-icons";
import { TbHeadphonesOff, TbHeadphones } from "react-icons/tb";
import { pageLinks } from "../../data/links/pageLinks";
import { FaTimes } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

const Navbar = ({ toggleAudio, muted }) => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <IconContext.Provider
      value={{
        color: "#FAFAFA",
        size: "1.5rem",
        className: "icons hover:text-orange-500",
      }}
    >
      <AnimatePresence>
        <nav className="min-w-screen min-h-[60px] flex justify-between items-center px-[1rem] md:px-[1.5rem] border-b-[1px] border-slate-700">
          <Link href="/">
            <h3 className="font-pixel text-[#FAFAFA] cursor-pointer hover:text-orange-400">
              HMDT
            </h3>
          </Link>
          <ul className="hidden font-pixel md:flex gap-[1rem]">
            {pageLinks.map((link, i) => {
              return (
                <Link href={link.href} key={`${link.title}-${i}`}>
                  <motion.li className="font-vcr cursor-pointe hover:text-orange-400">
                    {link.title}{" "}
                  </motion.li>
                </Link>
              );
            })}
            <motion.li
              onClick={toggleAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="max-h-[1.5rem] max-w-[1.5rem] cursor-pointer"
            >
              {muted ? <TbHeadphonesOff /> : <TbHeadphones />}
            </motion.li>
          </ul>
          <ul className="flex font-pixel md:hidden gap-[1rem]">
            <motion.li
              onClick={toggleAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="max-h-[1.5rem] max-w-[1.5rem] cursor-pointer"
            >
              {muted ? <TbHeadphonesOff /> : <TbHeadphones />}
            </motion.li>
            <li onClick={toggleNav}>
              {navOpen ? <FaTimes /> : <GiHamburgerMenu />}
            </li>
          </ul>
        </nav>
        {navOpen && (
          <motion.div
            key="answer"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="w-full flex font-vcr absolute top-[60px] bg-[#141414] above-all"
          >
            <ul className="flex flex-col divide-y divide-slate-700 w-full border-b border-slate-700">
              {pageLinks.map((link, i) => {
                return (
                  <Link href={link.href} key={`${link.title}-${i}`}>
                    <motion.li
                      className="font-vcr cursor-pointe hover:text-orange-400 py-[1rem] px-[.8rem]"
                      onClick={toggleNav}
                    >
                      {link.title}{" "}
                    </motion.li>
                  </Link>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </IconContext.Provider>
  );
};

export default Navbar;
