import React, { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal, ConnectButton } from "@rainbow-me/rainbowkit";
import MainButton from "./MainButton";
import NoAccount from "./NoAccount";
import { SessionContext } from "../context/SessionContext";
import { UserContext } from "../context/UserContext";

const NotConnected = ({ status }) => {
  const { session, handleLogIn } = useContext(SessionContext);
  const { user, validUser } = useContext(UserContext);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [isRemember, setIsRemember] = useState(false);

  const handleCheckboxChange = () => {
    setIsRemember(!isRemember);
  };

  useEffect(() => {}, [validUser, isConnected]);

  if (isConnected && validUser) {
    return (
      <div className="flex flex-col justify-center items-center gap-[1rem] h-[60%] md:h-[30%] aspect-video w-[90%] md:w-[80%] ">
        <MainButton
          onClick={async () => {
            await handleLogIn(isRemember);
          }}
          ariaLabel="Connect Wallet Button"
          width="w-[70%]"
        >
          Sign In
        </MainButton>
        <label className="font-vcr">
          <input
            type="checkbox"
            checked={isRemember}
            onChange={handleCheckboxChange}
            className="mr-[15px] cursor-pointer bg-slate-700 border-slate-800 text-slate-500 focus:ring-slate-800"
          />
          Remember me
        </label>
      </div>
    );
  } else if (isConnected && !validUser) {
    //may need to add styles to this
    return <NoAccount />;
  }

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
