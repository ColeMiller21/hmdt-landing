import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import UserActionSection from "../components/UserActionSection";
import TopBidTable from "../components/TopBidTable";
import SEO from "../components/SEO";

const helpMePrintETH = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  return (
    <>
      <SEO
        title="Help Me Print ETH"
        description="Something is fundamentally wrong. H3lp M3 D3bu8 Th15! This is the website for the Genesis Collection for the !Debog Universe"
      />
      <section className="flex min-h-full w-screen">
        <div className="flex flex-col w-full p-[1rem] gap-[2rem]">
          <h1 className=" font-pixel typewriter text-[3.5vw] xl:text-[2.75vw] my-[2rem] text-center">
            Help Me Print ETH
          </h1>
          <div className="flex-grow flex flex-col md:flex-row-reverse w-full md:my-[2.5rem]">
            <div className="flex justify-center items-center w-full">
              <div
                className={`border border-1 border-slate-700 rounded flex ${
                  isConnected
                    ? "flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.25rem]"
                    : "justify-center items-center h-[30%] aspect-video"
                }`}
              >
                {!isConnected ? (
                  <motion.button
                    type="button"
                    aria-label="Connect Wallet Button"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] text-center font-vcr"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </motion.button>
                ) : (
                  <UserActionSection />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <TopBidTable />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default helpMePrintETH;
