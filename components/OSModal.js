import React from "react";
import { socialLinks } from "../data/links/socialLinks";
import { motion } from "framer-motion";
import ModalComponent from "./Modal";

const OSModal = ({ onClose, show }) => {
  let collectionLinks = socialLinks.filter(
    (link) => link.type === "collection"
  );
  return (
    <ModalComponent onClose={onClose} show={show}>
      <div className="w-full flex flex-col items-center gap-[1.5rem]">
        {collectionLinks.map((link, i) => {
          return (
            <motion.a
              key={`${link.collectionTitle}-${i}`}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] text-center font-vcr hover:bg-slate-600"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.collectionTitle}
            </motion.a>
          );
        })}
      </div>
    </ModalComponent>
  );
};

export default OSModal;
