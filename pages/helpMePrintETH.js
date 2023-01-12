import React, { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
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

export async function getServerSideProps(ctx) {
  await connectMongo();
  const users = await User.find({}).sort({ bidAmount: -1 }).limit(10);
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
  const [topBidders, setTopBidders] = useState(users);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [ifUserEnrollAmount, setIfUserEnrollAmount] = useState(null);
  const [newTotalBalance, setNewTotalBalance] = useState(null);

  const headers = {
    secret: process.env.NEXT_PUBLIC_HMDT_API_KEY,
  };
  const getDBUser = async (addr) => {
    let { data } = await axios.get(`/api/user?address=${addr}`, { headers });
    if (!data.user) {
      setUser(null);
      return;
    }
    setUser(data.user);
  };

  const updateTopBidders = async () => {
    let { data } = await axios.get(`/api/user?address`, { headers });
    setTopBidders(data.users);
  };

  const submitBid = async (bidAmount) => {
    // console.log(bidAmount);
    if (bidAmount == 0) {
      //show toast message
      const message = "Bid amount cannot be 0";
      return { success: false, message };
    }
    if (bidAmount > user?.totalBalance) {
      //show a toast message
      const message = `Do not have enough $HP to make bid: ${bidAmount}`;
      return { success: false, message };
    } else if (bidAmount < user?.bidAmount) {
      //show a toast message
      const message = `You cannot bid less then you already have bid.`;
      return { success: false, message };
    }
    let payload = { ...user, currentBid: bidAmount };
    //will have to pass a secret before prod
    try {
      let { data } = await axios.put(
        `/api/user`,
        { user: payload },
        { headers }
      );
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
    setShowModal(true);
    let userAvailableBalance = user?.totalBalance - user?.bidAmount;
    let balanceAfterEnrollment = userAvailableBalance - config?.raffleThreshold;
    if (balanceAfterEnrollment < 0) {
      let ifUseBidAmountBalance = balanceAfterEnrollment + user?.bidAmount;
      setModalMessage(`Your current bidAmount does not leave you with enough HP to enter the raffle.
                  Would you like to use some of you bid to cover the cost? This would reduce your 
                  bid amount from ${user?.bidAmount} to ${ifUseBidAmountBalance}. Please confirm.`);
      setIfUserEnrollAmount(ifUseBidAmountBalance);
      return;
    }
    setModalMessage("Awesome enough HP! You are now enrolled!");
    let totalBalance = user?.totalBalance - config?.raffleThreshold;
    setNewTotalBalance(totalBalance);
  };

  const enrollUser = async () => {
    let userToUpdate = {
      ...user,
      enrolled: true,
      bidAmount: ifUserEnrollAmount ? ifUserEnrollAmount : user?.bidAmount,
      totalBalance: newTotalBalance ? newTotalBalance : user?.totalBalance,
    };
    let { data } = await axios.put(
      "/api/enrollUser",
      { user: userToUpdate },
      { headers }
    );
    setUser(data.user);
    setShowModal(false);
    await updateTopBidders();
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
        description="Something is fundamentally wrong. H3lp M3 D3bu8 Th15! This is the website for the Genesis Collection for the !Debog Universe"
        path="/helpMePrintETH"
      />
      <section className="flex min-h-full w-screen">
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
                <div
                  className={`border border-1 border-slate-700 rounded flex ${
                    isConnected
                      ? "flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.25rem]"
                      : "justify-center items-center h-[60%] aspect-video w-[90%] md:w-[80%]"
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
                    <UserActionSection user={user} submitBid={submitBid} />
                  )}
                </div>
                <RaffleSection
                  user={user}
                  enrollUser={triggerModal}
                  raffleThreshold={config?.raffleThreshold}
                />
              </div>
            )}
            <div className="flex justify-center items-center w-full">
              <TopBidTable users={topBidders} />
            </div>
          </div>
        </div>
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
                aria-label="Connect Wallet Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                onClick={enrollUser}
              >
                Enroll
              </motion.button>
              <motion.button
                type="button"
                aria-label="Connect Wallet Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </Modal>
      </section>
    </>
  );
};

export default helpMePrintETH;
