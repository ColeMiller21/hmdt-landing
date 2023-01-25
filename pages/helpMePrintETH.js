import React, { useState, useEffect, useContext } from "react";
import { useAccount, useProvider } from "wagmi";
import UserActionSection from "../components/UserActionSection";
import TopBidTable from "../components/TopBidTable";
import SEO from "../components/SEO";
import ResponsiveBannerImage from "../components/ResonsiveBannerImage";
import axios from "axios";
import RaffleSection from "../components/RaffleSection";
import connectMongo from "../lib/connectMongo";
import User from "../lib/models/User";
import Config from "../lib/models/Config";
import FAQ from "../components/Sections/FAQ";
import Countdown from "../components/Countdown";
import PageTitle from "../components/PageTitle";
import NotConnected from "../components/NotConnected";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import { hmpeQuestions } from "../data/faq/hmpeFAQ";
import { validateBidAmount } from "../utils/bidHelper.js";
import EnrollModal from "../components/EnrollModal";
import UnenrollModal from "../components/UnenrollModal";

const headers = {
  secret: process.env.NEXT_PUBLIC_HMDT_API_KEY,
};

export async function getStaticProps(ctx) {
  await connectMongo();
  const users = await User.find({}).sort({ bidAmount: -1 }).limit(12);
  const config = await Config.findOne({ page: "hmpe" });
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      config: JSON.parse(JSON.stringify(config)),
    },
    revalidate: 60,
  };
}

const helpMePrintETH = ({ users, config }) => {
  const { user, updateUser, loadingUser } = useContext(UserContext);
  const { address, isConnected } = useAccount();
  const [topBidders, setTopBidders] = useState(users);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [ifUserEnrollAmount, setIfUserEnrollAmount] = useState(null);
  const [newTotalBalance, setNewTotalBalance] = useState(null);
  const [enrollSuccess, setEnrollSuccess] = useState(null);
  const [enrollError, setEnrollError] = useState(null);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  const updateTopBidders = async () => {
    let { data } = await axios.get(`/api/user`, { headers });
    setTopBidders(data.users);
  };

  const submitBid = async (bidAmount) => {
    bidAmount = Math.round(bidAmount);
    let { success, message } = validateBidAmount(bidAmount, user);
    if (!success) {
      return { success, message };
    }
    let payload = { ...user, bidAmount };
    try {
      let { data } = await axios.put(
        `/api/user`,
        { user: payload },
        { headers }
      );
      await updateUser(data.user);
      await updateTopBidders();
      return { success: true, message: "Bid Submitted Successfully" };
    } catch (err) {
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
      "Awesome you have enough HP! You are qualified to sign up for the raffle!"
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
      await updateUser(data.user);
      await updateTopBidders();
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
      await updateUser(data.user);
      await updateTopBidders();
      setEnrollSuccess("Successfully unenrolled!");
      setTimeout(() => {
        setEnrollSuccess(null);
      }, 2500);
      setShowUnenrollModal(false);
    } catch (err) {
      console.log(err);
      setShowUnenrollModal(false);
      setEnrollError(err.message);
      setTimeout(() => {
        setEnrollError(null);
      }, 2500);
    }
  };

  useEffect(() => {
    if (isConnected) {
      (async () => {
        await updateTopBidders();
      })();
    }
  }, [user]);

  return (
    <>
      <SEO
        title="Help Me Print ETH"
        description="A mechanism that holders pay NOTHING, need NO gas-required operations on their end, and get ETH winnings from an algorithmic-trading protocol (aka HMDT Algo-Bot)"
        path="/helpMePrintETH"
      />
      <section className="flex min-h-full w-full mt-[70px]">
        <div className="flex flex-col w-full p-[1rem] gap-[2rem] px-[1rem]">
          <PageTitle text="Help Me Print ETH" />
          <ResponsiveBannerImage />
          <Countdown />
          <div className="flex-grow flex flex-col md:flex-row-reverse w-full md:my-[2.5rem]">
            {loadingUser ? (
              <Loader />
            ) : (
              <div className="flex flex-col justify-center items-center w-full gap-[1.5rem]">
                {isConnected ? (
                  <UserActionSection submitBid={submitBid} />
                ) : (
                  <NotConnected />
                )}
                <RaffleSection
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
          <FAQ faqQuestions={hmpeQuestions} title="Help Me Print ETH FAQs" />
        </div>
        <UnenrollModal
          onClose={() => setShowUnenrollModal(false)}
          show={showUnenrollModal}
          raffleThreshold={config?.raffleThreshold}
          unenrollUser={unenrollUser}
          error={enrollError}
          success={enrollSuccess}
        />
        <EnrollModal
          onClose={() => setShowModal(false)}
          show={showModal}
          message={modalMessage}
          enrollUser={enrollUser}
          error={enrollError}
          success={enrollSuccess}
        />
      </section>
    </>
  );
};

export default helpMePrintETH;
