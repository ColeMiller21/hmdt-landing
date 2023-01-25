import React from "react";
import { motion } from "framer-motion";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import MainButton from "./MainButton";

const NotConnected = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="flex justify-center items-center h-[60%] md:h-[30%] aspect-video w-[90%] md:w-[80%] ">
      <MainButton
        onClick={openConnectModal}
        ariaLabel="Connect Wallet Button"
        width="w-[70%]"
      >
        Connect Wallet
      </MainButton>
    </div>
  );
};

export default NotConnected;
