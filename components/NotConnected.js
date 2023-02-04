import React from "react";
import { motion } from "framer-motion";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import MainButton from "./MainButton";

const NotConnected = ({ status }) => {
  const { openConnectModal } = useConnectModal();
  let button;
  switch (status) {
    case 1:
      button = (
        <div className="flex justify-center items-center h-[60%] md:h-[30%] aspect-video w-[90%] md:w-[80%] ">
          <MainButton
            onClick={openConnectModal}
            ariaLabel="Connect Wallet Button"
            width="w-[70%]"
          >
            Sign In
          </MainButton>
        </div>
      );

      break;
    case 0:
      button = (
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

      break;
    default:
      button = <h1>Connected and signed in</h1>;
      break;
  }

  return button;
};

export default NotConnected;
