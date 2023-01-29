import React, { useContext, useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserContext } from "../context/UserContext";
import PageTitle from "../components/PageTitle";
import ModalComponent from "../components/Modal";
import ResponseMessage from "../components/ResponseMessage";
import NotConnected from "../components/NotConnected";
import { motion, AnimatePresence } from "framer-motion";
import { formatAddress, isValidAddress } from "../utils/ethersHelper";
import MainButton from "../components/MainButton";
import { IconContext } from "react-icons";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Slider from "../components/Slider";

const profile = () => {
  const { address, isConnected } = useAccount();
  const user = useContext(UserContext);

  return (
    <div className="w-full mt-[70px]">
      {isConnected ? (
        <UserDashboard />
      ) : (
        <div className="w-full flex items-center justify-center">
          <div className="w-full md:w-[60%] lg:w-[40%] h-auto flex justify-center">
            <NotConnected />
          </div>
        </div>
      )}
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="h-full min-w-screen items-center flex flex-col gap-[1.5rem] p-[2rem]">
      <PageTitle text="Help Me Profile" />
      <div className="flex flex-col items-center lg:items-stretch lg:flex-row gap-[1.5rem] lg:gap-[1rem] w-full">
        <ProfileSection />
        <BalanceSection />
      </div>
    </div>
  );
};

const SectionWrapper = ({ children }) => {
  return (
    <div className="w-full md:w-[70%] lg:w-full flex flex-col p-[2rem] font-vcr  border-1 border-slate-700 rounded">
      {children}
    </div>
  );
};

const BalanceSection = () => {
  const { user, updateUser } = useContext(UserContext);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(null);
  const [transferToAddress, setTransferToAddress] = useState(null);

  const transferHP = async () => {
    let transferAmountInt = Math.round(transferAmount);
    if (transferAmount <= 0 || !transferToAddress) {
      setTransferError("Must have an amount > 0 and valid address");
      setTimeout(() => {
        setTransferError(null);
      }, 2500);
      return;
    } else if (transferAmount != transferAmountInt) {
      setTransferError("Transfer amount must be an integer");
      setTimeout(() => {
        setTransferError(null);
      }, 2500);
      return;
    } else if (!isValidAddress(transferToAddress.trim())) {
      setTransferError("Must submit a valid address");
      setTimeout(() => {
        setTransferError(null);
      }, 2500);
      return;
    } else if (transferAmount > user?.totalBalance - user?.bidAmount) {
      setTransferError("Cannot send more HP than max amount above");
      setTimeout(() => {
        setTransferError(null);
      }, 2500);
      return;
    } else if (
      transferToAddress.toLowerCase() === user?.address.toLowerCase()
    ) {
      setTransferError("Cannot transfer to your own address");
      setTimeout(() => {
        setTransferError(null);
      }, 2500);
      return;
    }
    let userToUpdate = {
      ...user,
      totalBalance: user?.totalBalance - transferAmount,
    };
    let transferPayload = {
      user: userToUpdate,
      transferAmount,
      transferToAddress: transferToAddress.trim(),
    };

    try {
      let { data } = await axios.post(
        "/api/transfer",
        { transferPayload },
        { headers }
      );
      await updateUser(data.user);
      setTransferSuccess("Successfully transferred HPD!");
      setTimeout(() => {
        setTransferSuccess(null);
        setTransferAmount(0);
        setTransferToAddress(null);
        setShowTransferModal(false);
      }, 2500);
    } catch (err) {
      setTransferError(
        "500 Error: Ensure transfer to address that is a registered holder of HMDT"
      );
      setTimeout(() => {
        setTransferError(null);
      }, 2500);
    }
  };

  const closeAndResetTransferModal = () => {
    setShowTransferModal(false);
    setTransferAmount(0);
    setTransferToAddress(null);
  };
  return (
    <>
      <SectionWrapper>
        <h3 className="text-[2rem] text-center">Balance/Bid Information</h3>
        <div className="w-full border-slate-700 border-1 my-[.8rem]"></div>
        <div className="flex flex-col items-center gap-[1.5rem]">
          <span className="flex justify-center text-[1.2rem]">
            <label className="mr-[5px]">HP Balance:</label>
            <span className="text-orange-400">{user?.totalBalance}</span>
          </span>
          <h6 className="text-[1.25rem] text-center">
            Current Bid & Raffle Status
          </h6>
          <div className="w-full overflow-x-auto flex-grow">
            <table className="table-auto w-full text-center">
              <thead>
                <tr className="">
                  <th className="px-4 py-2 text-left">Cycle</th>
                  <th className="px-4 py-2">Bid Amount</th>
                  <th className="px-4 py-2">Raffle</th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td className="px-4 py-2 text-left">HelpMePrintETH</td>
                  <td className=" px-4 py-2 text-orange-400">
                    {user?.bidAmount}
                  </td>
                  <td className=" px-4 py-2 text-orange-400">
                    {user?.enrolled ? "Enrolled" : "Not Enrolled"}
                  </td>
                </tr>
                {/* <tr className="">
                  <td className=" px-4 py-2 text-left">HelpMeCollectNFTs</td>
                  <td className=" px-4 py-2 text-orange-400">
                    {user?.bidAmountNFT}
                  </td>
                  <td className=" px-4 py-2 text-orange-400">
                    {user?.enrolledNFT ? "Enrolled" : "Not Enrolled"}
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
          {user &&
          user?.totalBalance - (user?.bidAmount + user?.bidAmountNFT) > 0 ? (
            <MainButton
              onClick={() => setShowTransferModal(true)}
              ariaLabel="Trigger Transfer HP Wallet Modal"
            >
              {" "}
              Transfer $HPD
            </MainButton>
          ) : (
            <></>
          )}
        </div>
      </SectionWrapper>
      <ModalComponent
        onClose={() => closeAndResetTransferModal()}
        show={showTransferModal}
      >
        <div className="flex flex-col gap-[1.5rem] items-center justify-center p-[1rem] font-vcr text-white text-center">
          <p className="">
            Max transfer amount: {user?.totalBalance - user?.bidAmount}
          </p>
          <div className="flex justify-center items-center gap-[1rem]">
            <label for="hp amount">Amount to transfer</label>
            <input
              name="hp amount"
              type="number"
              min={0}
              max={user?.totalBalance - user?.bidAmount}
              placeholder="HP"
              className="h-[45px] w-[50px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
              onChange={(e) => setTransferAmount(e.target.value)}
              value={transferAmount}
            />
          </div>
          <div className="flex flex-col">
            <label for="transferTo"> Transfer to address:</label>
            <input
              name="transferTo"
              type="text"
              placeholder="Enter Address"
              className="h-[45px] w-[250px] md:w-[400px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
              onChange={(e) => setTransferToAddress(e.target.value)}
              value={transferToAddress}
            />
          </div>
          <MainButton
            onClick={async () => await transferHP()}
            ariaLabel="Transfer Button"
          >
            Transfer HP
          </MainButton>
          <ResponseMessage error={transferError} success={transferSuccess} />
        </div>
      </ModalComponent>
    </>
  );
};

const ProfileSection = () => {
  const { user, updateUser } = useContext(UserContext);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [offChainWallet, setOffChainWallet] = useState(null);
  const [ocwSuccess, setOCWSuccess] = useState(null);
  const [ocwError, setOCWError] = useState(null);

  const updateOffChainWallet = async () => {
    if (offChainWallet === "") return;
    let userToUpdate = {
      ...user,
      offChainWallet: offChainWallet.trim(),
    };
    if (!isValidAddress(offChainWallet.trim())) {
      setOCWError("Not a valid ERC20 address");
      setTimeout(() => {
        setOCWError(null);
      }, 2500);
      return;
    }
    try {
      let res = await updateUser({ user: userToUpdate });
      console.log("RESULT:", res);
      setOCWSuccess("Successfully set off chain wallet!");
      setTimeout(() => {
        setOCWSuccess(null);
        setShowWalletModal(false);
      }, 1500);
    } catch (err) {
      setOCWError(err.message);
      setTimeout(() => {
        setOCWError(null);
      }, 1500);
    }
  };

  return (
    <>
      <SectionWrapper>
        <div className="flex flex-col items-center min-h-full">
          <h3 className="text-[2rem] text-center">Address Information</h3>
          <div className="w-full border-slate-700 border-1 my-[.8rem]"></div>
          <h6 className="text-[1.2rem] flex ">
            <span className="mr-[5px]">Profile Status:</span>
            <span
              className={`${
                user?.nftCount > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {user?.nftCount > 0 ? "ACTIVE" : "INACTIVE"}
            </span>
          </h6>
          <div className="flex flex-col gap-[.8rem] my-[1.5rem] flex-grow justify-center">
            <span className="flex justify-between items-center">
              <label className="mr-[5px]">Connected Address: </label>
              <span className="hidden xl:block text-orange-400">
                <ConnectButton showBalance={false} chainStatus="none" />
              </span>
            </span>
            <span className="flex justify-between">
              <label className="mr-[5px]">Address: </label>
              <span className="xl:hidden text-orange-400">
                {user?.displayAddress?.includes(".eth")
                  ? user?.displayAddress
                  : formatAddress(user?.displayAddress)}
              </span>
              <span className="hidden xl:block text-orange-400">
                {user?.displayAddress}
              </span>
            </span>
            <span className="flex justtify-between">
              <label className="mr-[5px]"> Delagate Address: </label>
              <span className="xl:hidden text-orange-400">
                {user?.offChainWallet?.includes(".eth")
                  ? user?.offChainWallet
                  : formatAddress(user?.offChainWallet)}
              </span>
              <span className="hidden xl:block text-orange-400">
                {user?.offChainWallet}
              </span>
            </span>
          </div>
          <div className="w-full flex items-center justify-center">
            <MainButton
              ariaLabel="Trigger Off Chain Wallet Modal"
              onClick={() => setShowWalletModal(true)}
            >
              Set Delegate Wallet
            </MainButton>
          </div>
        </div>
      </SectionWrapper>
      <ModalComponent
        onClose={() => setShowWalletModal(false)}
        show={showWalletModal}
      >
        <div className="flex flex-col gap-[1.5rem] items-center justify-center p-[1rem] font-vcr text-white text-center">
          <p className="">
            Use the input below to set a wallet to use incase your HMDT is in a
            wallet that cannot interact with etherscan or if you want to set an
            delegate wallet
          </p>
          {user?.offChainWallet ? (
            <div className="text-center">
              <p>Current off chain wallet:</p>
              <p className="lg:hidden">{formatAddress(user?.offChainWallet)}</p>
              <p className="hidden lg:block">{user?.offChainWallet}</p>
            </div>
          ) : (
            <></>
          )}
          <input
            type="text"
            placeholder="Enter Address"
            className="h-[45px] w-[250px] md:w-[400px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
            onChange={(e) => setOffChainWallet(e.target.value)}
            value={offChainWallet}
          />
          <motion.button
            type="button"
            aria-label="Add Off Chain Wallet Button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
            onClick={async () => await updateOffChainWallet()}
          >
            Add Wallet
          </motion.button>
          <ResponseMessage error={ocwError} success={ocwSuccess} />
        </div>
      </ModalComponent>
    </>
  );
};

const NFTViewSection = ({ title }) => {
  const [viewOpen, setViewOpen] = useState(false);

  const toggleView = () => {
    setViewOpen(!viewOpen);
  };
  return (
    <AnimatePresence>
      <IconContext.Provider
        value={{
          color: "#FAFAFA",
          size: "1.5rem",
          className: " hover:text-orange-500",
        }}
      >
        <div className="w-full flex flex-col p-[2rem] font-vcr  border-1 border-slate-700 rounded">
          <div className="flex justify-between items-center">
            <h3 className="font-vcr text-[1.2rem] md:text-[2rem]">
              <span className="text-orange-400">My </span>
              {title}
            </h3>
            <span
              aria-label="Dropdown Button"
              onClick={toggleView}
              className="cursor-pointer"
            >
              {viewOpen ? <FaChevronDown /> : <FaChevronUp />}
            </span>
          </div>
          {viewOpen && (
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
              className="w-full py-[1.5rem]"
            >
              <Slider type="hmdt" />
            </motion.div>
          )}
        </div>
      </IconContext.Provider>
    </AnimatePresence>
  );
};

export default profile;
