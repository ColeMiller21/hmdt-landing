import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SyncLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useAccount, useProvider, useSigner, useNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import UserActionSection from "../components/UserActionSection";
import TopBidTable from "../components/TopBidTable";
import SEO from "../components/SEO";
import ResponsiveBannerImage from "../components/ResonsiveBannerImage";
import axios from "axios";
import RaffleSection from "../components/RaffleSection";
import { toast, ToastContainer } from "react-toastify";

const helpMePrintETH = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const showErrorToast = (message) => {
    console.log("here");
    toast.error(message, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const getDBUser = async (addr) => {
    let { data } = await axios.get(`/api/user?address=${addr}`);
    if (!data.user) {
      setUser(null);
      return;
    }
    setUser(data.user);
  };

  const submitBid = async (bidAmount) => {
    console.log("settingbidAmount: ", bidAmount);
    // console.log(bidAmount);
    if (bidAmount == 0) {
      //show toast message
      const message = "Bid amount cannot be 0";
      showErrorToast(message);
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
      let { data } = await axios.put(`/api/user`, { user: payload });
      setUser(data.user);
      return { success: true, message: "Bid Submitted Successfully" };
    } catch (err) {
      //show a toast with appropriate message
      console.error("ERROR: ", err);
      return { success: true, message: err.message };
    }
  };

  const enrollUser = async () => {
    //here need to just set the user to enrolled
    let userToUpdate = {
      ...user,
      enrolled: true,
    };

    let { data } = await axios.put("/api/enrollUser", { user: userToUpdate });
    setUser(data.user);
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
            <h1 className=" font-pixel typewriter text-[4.5vw] xl:text-[2.75vw] my-[4rem] text-center">
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
                    <UserActionSection user={user} submitBid={submitBid} />
                  )}
                </div>
                <RaffleSection user={user} enrollUser={enrollUser} />
              </div>
            )}
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
