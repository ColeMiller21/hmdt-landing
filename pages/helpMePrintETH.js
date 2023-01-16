import React, { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useAccount, useProvider } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import UserActionSection from "../components/UserActionSection";
import TopBidTable from "../components/TopBidTable";
import SEO from "../components/SEO";
import ResponsiveBannerImage from "../components/ResonsiveBannerImage";
import axios from "axios";
import RaffleSection from "../components/RaffleSection";
import connectMongo from "../lib/connectMongo";
import User from "../lib/models/User";
import Config from "../lib/models/Config";
import Modal from "../components/Modal";
import { getContract } from "../utils/getContract";
import {
  formatBigNumber,
  formatAddress,
  isValidAddress,
  ALCHEMY_PROVIDER,
} from "../utils/ethersHelper";
import FAQ from "../components/Sections/FAQ";
import ResponseMessage from "../components/ResponseMessage";

export async function getServerSideProps(ctx) {
  await connectMongo();
  const users = await User.find({}).sort({ bidAmount: -1 }).limit(12);
  const config = await Config.findOne({ page: "hmpe" });
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      config: JSON.parse(JSON.stringify(config)),
    },
  };
}

const helpMePrintETH = ({ users, config }) => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const [topBidders, setTopBidders] = useState(users);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [ifUserEnrollAmount, setIfUserEnrollAmount] = useState(null);
  const [newTotalBalance, setNewTotalBalance] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [offChainWallet, setOffChainWallet] = useState(null);
  const [enrollSuccess, setEnrollSuccess] = useState(null);
  const [enrollError, setEnrollError] = useState(null);
  const [ocwSuccess, setOCWSuccess] = useState(null);
  const [ocwError, setOCWError] = useState(null);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(null);
  const [transferToAddress, setTransferToAddress] = useState(null);

  const headers = {
    secret: process.env.NEXT_PUBLIC_HMDT_API_KEY,
  };

  const getDBUser = async (addr) => {
    let { data } = await axios.get(`/api/user?address=${addr}`, { headers });
    if (!data.user) {
      setUser(null);
      return;
    }

    let contract = getContract(ALCHEMY_PROVIDER, "hmdt");
    let nfts = await contract.functions.balanceOf(data.user?.address);
    nfts = formatBigNumber(nfts[0]);
    if (!data.user || nfts === 0) {
      setUser(null);
      return;
    }

    setUser(data.user);
  };

  const updateTopBidders = async () => {
    let { data } = await axios.get(`/api/user`, { headers });
    setTopBidders(data.users);
  };

  const submitBid = async (bidAmount) => {
    if (bidAmount == 0) {
      //show toast message
      const message = "Bid amount cannot be 0";
      return { success: false, message };
    }
    if (bidAmount > user?.totalBalance) {
      //show a toast message
      const message = `Do not have enough $HP to make bid: ${bidAmount}`;
      return { success: false, message };
    } else if (bidAmount <= user?.bidAmount) {
      //show a toast message
      const message = `You cannot bid less or equal then you already have bid.`;
      return { success: false, message };
    }
    let payload = { ...user, bidAmount };
    try {
      let { data } = await axios.put(
        `/api/user`,
        { user: payload },
        { headers }
      );
      setEnrollSuccess("");
      setUser(data.user);
      await updateTopBidders();
      return { success: true, message: "Bid Submitted Successfully" };
    } catch (err) {
      //show a toast with appropriate message
      console.error("ERROR: ", err);
      return { success: false, message: err.message };
    }
  };

  const triggerModal = async () => {
    if (user?.totalBalance < config?.raffleThreshold) {
      setEnrollError("You do not have enough $HP to enroll this cycle");
      setTimeout(() => {
        setEnrollError(null);
      }, 2500);
      return;
    }
    setShowModal(true);
    let userAvailableBalance = user?.totalBalance - user?.bidAmount;
    let balanceAfterEnrollment = userAvailableBalance - config?.raffleThreshold;
    if (balanceAfterEnrollment < 0) {
      let ifUseBidAmountBalance = balanceAfterEnrollment + user?.bidAmount;
      let totalBalance = balanceAfterEnrollment + user?.totalBalance;
      setModalMessage(`Your current bid amount does not leave you with enough HP to enter the raffle.
                  Would you like to use some of you bid to cover the cost? This would reduce your 
                  bid amount from ${user?.bidAmount} to ${ifUseBidAmountBalance} and use the remaining amount of your total balance.
                   Please confirm.`);
      setIfUserEnrollAmount(ifUseBidAmountBalance);
      setNewTotalBalance(totalBalance);
      return;
    }
    setModalMessage(
      "Awesome you have enough HP! Confirm to enroll in the raffle!"
    );
    let totalBalance = user?.totalBalance - config?.raffleThreshold;
    setNewTotalBalance(totalBalance);
  };

  const enrollUser = async () => {
    let userToUpdate = {
      ...user,
      enrolled: true,
      bidAmount:
        ifUserEnrollAmount !== null ? ifUserEnrollAmount : user?.bidAmount,
      totalBalance:
        newTotalBalance !== null ? newTotalBalance : user?.totalBalance,
    };
    try {
      let { data } = await axios.put(
        "/api/enrollUser",
        { user: userToUpdate },
        { headers }
      );
      setUser(data.user);
      setEnrollSuccess("Successfully enrolled!");
      setTimeout(() => {
        setEnrollSuccess(null);
      }, 2500);
      setShowModal(false);
    } catch (err) {
      console.log(err);
      setEnrollError(err.message);
      setTimeout(() => {
        setEnrollError(null);
      }, 2500);
    }
    await updateTopBidders();
  };

  const unenrollUser = async () => {
    let newTotalBalance = user?.totalBalance + config?.raffleThreshold;
    if (typeof newTotalBalance !== "number") {
      return;
    }
    let userToUpdate = {
      ...user,
      enrolled: false,
      totalBalance: newTotalBalance,
    };

    try {
      let { data } = await axios.put(
        "/api/enrollUser",
        { user: userToUpdate },
        { headers }
      );
      setUser(data.user);
      setEnrollSuccess("Successfully unenrolled!");
      setTimeout(() => {
        setEnrollSuccess(null);
      }, 2500);
      setShowUnenrollModal(false);
    } catch (err) {
      console.log(err);
      setEnrollError(err.message);
      setTimeout(() => {
        setEnrollError(null);
      }, 2500);
    }

    await updateTopBidders();
  };

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
      let { data } = await axios.put(
        "/api/user",
        { user: userToUpdate },
        { headers }
      );
      setUser(data.user);
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

  const transferHP = async () => {
    if (transferAmount == 0 || !transferToAddress) {
      setTransferError("Must have an amount > 0 and valid address");
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
      setUser(data.user);
      setTransferSuccess("Successfully transferred HP!");
      setTimeout(() => {
        setTransferSuccess(null);
        setTransferAmount(0);
        setTransferToAddress(null);
        setShowTransferModal(false);
      }, 2500);
    } catch (err) {
      setTransferError(
        "500 Error: Ensure transfer to address is a registered holder of HMDT"
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

  useEffect(() => {
    if (isConnected) {
      setLoadingUser(true);
      (async () => {
        await getDBUser(address);
        setLoadingUser(false);
      })();
    }
  }, [isConnected, address]);

  return (
    <>
      <SEO
        title="Help Me Print ETH"
        description="A mechanism that holders pay NOTHING, need NO gas-required operations on their end, and get ETH winnings from an algorithmic-trading protocol (aka HMDT Algo-Bot)"
        path="/helpMePrintETH"
      />
      <section className="flex min-h-full w-full">
        <div className="flex flex-col w-full p-[1rem] gap-[2rem] px-[1rem]">
          <div className="object-contain">
            <h1 className=" font-pixel typewriter text-[4.5vw] xl:text-[2.75vw] text-center p-[1rem]">
              Help Me Print ETH
            </h1>
          </div>
          <ResponsiveBannerImage />
          <div className="flex-grow flex flex-col md:flex-row-reverse w-full md:my-[2.5rem]">
            {loadingUser ? (
              <div className="flex flex-col justify-center items-center w-full lg:min-h-full">
                <div className="p-[2.5rem] flex flex-col items-center gap-[1rem]">
                  <SyncLoader color="#FAFAFA" />
                  <span className="font-pixel">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full gap-[1.5rem]">
                {user ? (
                  <div className="w-full flex flex-col justify-center items-center gap-[1.5rem]">
                    <motion.button
                      type="button"
                      aria-label="Trigger Off Chain Wallet Modal"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                      onClick={() => setShowWalletModal(true)}
                    >
                      Set Off Chain Wallet
                    </motion.button>
                    {user?.totalBalance - user?.bidAmount > 0 ? (
                      <motion.button
                        type="button"
                        aria-label="Trigger Transfer HP Wallet Modal"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                        onClick={() => setShowTransferModal(true)}
                      >
                        Transfer $HP
                      </motion.button>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <div
                  className={`border border-1 border-slate-700 rounded flex ${
                    isConnected
                      ? "flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.25rem]"
                      : "justify-center items-center h-[60%] md:h-[30%] aspect-video w-[90%] md:w-[80%]"
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
                    <>
                      <UserActionSection user={user} submitBid={submitBid} />
                    </>
                  )}
                </div>
                <RaffleSection
                  user={user}
                  enrollUser={triggerModal}
                  unenrollUser={() => setShowUnenrollModal(true)}
                  raffleThreshold={config?.raffleThreshold}
                  error={enrollError}
                  success={enrollSuccess}
                />
              </div>
            )}
            <div className="flex justify-center items-center w-full">
              <TopBidTable users={topBidders} />
            </div>
          </div>
          <FAQ />
        </div>
        <Modal
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
            <motion.button
              type="button"
              aria-label="Transfer Button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
              onClick={async () => await transferHP()}
            >
              Transfer HP
            </motion.button>
            <ResponseMessage error={transferError} success={transferSuccess} />
          </div>
        </Modal>
        <Modal
          onClose={() => setShowUnenrollModal(false)}
          show={showUnenrollModal}
        >
          <div className="flex flex-col p-[2rem]">
            <p className="font-vcr text-white text-center mb-[2rem]">
              Click Unenroll to unenroll raffle threshold of -{" "}
              {config?.raffleThreshold} will be added to your $HP balance.
            </p>
            <div className="flex flex-col justify-center items-center w-full gap-[1rem]">
              <motion.button
                type="button"
                aria-label="Enroll Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                onClick={unenrollUser}
              >
                Unenroll
              </motion.button>
            </div>
            <ResponseMessage error={ocwError} success={ocwSuccess} />
          </div>
        </Modal>
        <Modal onClose={() => setShowWalletModal(false)} show={showWalletModal}>
          <div className="flex flex-col gap-[1.5rem] items-center justify-center p-[1rem] font-vcr text-white text-center">
            <p className="">
              Use the input below to set a wallet to use incase your HMDT is in
              a wallet that cannot interact with etherscan or if you want to set
              an off-chain wallet
            </p>
            {user?.offChainWallet ? (
              <div className="text-center">
                <p>Current off chain wallet:</p>
                <p className="lg:hidden">
                  {formatAddress(user?.offChainWallet)}
                </p>
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
        </Modal>
        <Modal
          onClose={() => setShowModal(false)}
          show={showModal}
          message={modalMessage}
        >
          <div className="flex flex-col p-[2rem]">
            <p className="font-vcr text-white text-center mb-[2rem]">
              {modalMessage}
            </p>
            <div className="flex flex-col justify-center items-center w-full gap-[1rem]">
              <motion.button
                type="button"
                aria-label="Enroll Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                onClick={enrollUser}
              >
                Enroll
              </motion.button>
              <motion.button
                type="button"
                aria-label="Cancel Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </motion.button>
            </div>
            <ResponseMessage error={ocwError} success={ocwSuccess} />
          </div>
        </Modal>
      </section>
    </>
  );
};

export default helpMePrintETH;
