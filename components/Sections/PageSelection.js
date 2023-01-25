import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PageSelection = () => {
  return (
    <section className="flex flex-col items-center pt-[5rem] font-vcr w-full">
      <div className="flex flex-col md:flex-row gap-[2.5rem] items-center">
        <div className="w-full flex justify-center items-center p-[1rem]">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Link href="/helpMePrintETH">
              <button className="relative w-[250px] h-[80px] bg-black rounded-lg leading-none flex items-center justify-center">
                <span className="flex items-center justify-center">
                  <span className="">HelpMePrintETH</span>
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
        <div className="w-full flex justify-center items-center">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Link href="/helpMeCollectNFTS">
              <button className="relative  w-[250px] h-[80px] bg-black rounded-lg leading-none flex items-center justify-center">
                <span className="flex items-center justify-center">
                  <span className="">HelpMeCollectNFTS</span>
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PageSelection;
