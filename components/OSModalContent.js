import React from "react";
import { socialLinks } from "../utils/socialLinks";
import { motion } from "framer-motion";

const OSModalContent = () => {
  let collectionLinks = socialLinks.filter(
    (link) => link.type === "collection"
  );
  return (
    <div className="w-full flex flex-col items-center gap-[1.5rem]">
      {collectionLinks.map((link, i) => {
        return (
          <motion.a
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] text-center font-vcr"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.collectionTitle}
          </motion.a>
        );
      })}
    </div>
  );
};

export default OSModalContent;
