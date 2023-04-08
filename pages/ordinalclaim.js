import React, { useContext, useEffect, useState } from "react";
import SEO from "../components/SEO";
import FAQ from "../components/Sections/FAQ";
import { motion } from "framer-motion";
import { useAccount, useProvider } from "wagmi";
import { UserContext } from "../context/UserContext";
import { SessionContext } from "../context/SessionContext";
import PageTitle from "../components/PageTitle";
import ResponseMessage from "../components/ResponseMessage";
import NotConnected from "../components/NotConnected";
import NoAccount from "../components/NoAccount";
import { getUserNFTS } from "../utils/imageHelper";
import Loader from "../components/Loader";
import MainButton from "../components/MainButton";
import axios from "axios";

const ordinalclaim = () => {
  const { isConnected } = useAccount();
  const { user, validUser } = useContext(UserContext);
  const { session } = useContext(SessionContext);
  return (
    <>
      <SEO title="Oridnal Claim" description="" path="/claimbtc" />
      <div className="w-full mt-[70px]">
        {isConnected && validUser && session ? (
          <div className="w-full flex flex-col items-center gap-[1.5rem]">
            <PageTitle text="Claim HMDT Ordinal" />
            <DebugStatusSection />
            <ClaimSection />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <div className="w-full md:w-[60%] lg:w-[40%] h-auto flex justify-center">
              <NotConnected />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const DebugStatusSection = () => {
  const [tokenId, setTokenId] = useState(null);
  const [selectedDebug, setSelectedDebug] = useState(null);

  const checkDebugStatus = async () => {
    if (!tokenId) return;
    let { data } = await axios.get(`/api/getDebugStatus?id=${tokenId}`);
    data.image = `https://fafz.mypinata.cloud/ipfs/QmS3g1MArz2x45SNjYmADoeVdrP7wkH9qAZGksEAQrSKJk/${tokenId}.png`;
    console.log(data);
    setSelectedDebug(data);
  };

  const handleChange = (event) => {
    const newValue = Math.min(Math.max(event.target.value, 1), 855);
    setTokenId(newValue);
  };
  return (
    <div
      className={`border-1 border-orange-400 rounded flex gap-[1rem] flex-col items-center w-[90%] lg:w-[57%] px-[2rem] py-[1.75rem]`}
    >
      <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem] flex justify-center items-center">
        Check <span className="text-orange-400 mx-[10px]"> Debug </span> Status
      </h2>
      <div className="w-full flex items-center justify-center gap-[.5rem]">
        <label className="font-vcr">TokenId:</label>
        <input
          type="number"
          min="1"
          max="855"
          placeholder="ID"
          className="h-[45px] w-[100px] md:w-[100px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
          onChange={handleChange}
          value={tokenId}
        />
      </div>
      {selectedDebug && (
        <div className="w-full flex flex-col items-center font-vcr gap-[.5rem]">
          <img
            className="w-[40%] aspect-square"
            src={selectedDebug?.image}
            alt={`Debug #${tokenId}`}
          />
          <span>
            Claim Amount:{" "}
            <span className="text-orange-400">
              {selectedDebug?.claimAmount} HP
            </span>
          </span>
          <span>
            Claim Status:{" "}
            <span className="text-orange-400">
              {selectedDebug?.claimStatus}
            </span>
          </span>
        </div>
      )}
      <MainButton onClick={checkDebugStatus}>Check Status</MainButton>
    </div>
  );
};

const ClaimSection = () => {
  const { user, validUser, setBtcWallet, initClaim, startClaim } =
    useContext(UserContext);
  const { session, setSession, handleDisconnect } = useContext(SessionContext);
  const [hmdt, setHMDT] = useState(null);
  const [hmgt, setHMGT] = useState(null);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [btcWallet, setWallet] = useState(user?.btcWallet || null);
  const [tokenClaimAmount, setTokenClaimAmount] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);

  const handleTokenChange = async (id) => {
    setSelectedId(id);
    //TODO: need to set hmgt back to hmdt
    let nft = hmgt.find((h) => h.edition == id);
    setSelectedImage(nft.image);
    let { data } = await axios.get(`/api/getTokenClaimAmount?id=${id}`);
    setSelectedNft(data);
    setTokenClaimAmount(data.claimAmount);
  };

  const handleBtcWallet = async (btcWallet) => {
    if (!btcWallet || user?.btcWallet.toLowerCase() === btcWallet.toLowerCase())
      return;
    let res = await setBtcWallet(btcWallet);
  };

  const setError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 1500);
  };

  const setSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 1500);
  };

  const handleInitClaim = async () => {
    if (selectedId === "") return;
    let { success, message, data } = await initClaim(selectedId);
    setSelectedNft(data);

    if (!success) {
      setError(message);
      return;
    }
    setSuccess("Claim Initiated");
    return;
  };

  const handleStartClaim = async () => {
    if (selectedId === "") return;
    let availableBal = user?.totalBalance - user?.bidAmount;
    if (availableBal < tokenClaimAmount) {
      setError("Not enough HP to claim!");
      return;
    }
    let { success, message, data } = await startClaim(selectedId);
    setSelectedNft(data);
    if (!success) {
      setError(message);
      return;
    }
    setSuccess("Claim Initiated");
    return;
  };

  useEffect(() => {
    setLoadingNFTs(true);
    if (user) {
      (async () => {
        let { ownedHMDT, ownedHMGT } = await getUserNFTS(user?.address);
        setHMDT(ownedHMDT);
        setHMGT(ownedHMGT);
        setLoadingNFTs(false);
      })();
    }
  }, [user]);

  useEffect(() => {}, [validUser, session]);
  return (
    <div className="h-full min-w-screen items-center flex flex-col gap-[1.5rem] p-[2rem]">
      {validUser && session ? (
        <div className="flex flex-col items-center gap-[1.5rem] lg:gap-[1rem] w-full">
          <div className="flex flex-col items-center justify-center w-full lg:gap-[1rem]">
            <div
              className={`border-1 border-orange-400 rounded flex gap-[1rem] flex-col items-center w-[90%] lg:w-[60%] px-[2rem] py-[1.75rem]`}
            >
              <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem] flex justify-center items-center">
                Start Claim
              </h2>
              <span className="flex justify-center items-center w-full lg:w-[70%]">
                <label className="font-vcr mr-[5px]">HMDT Token ID: </label>
                <select
                  className="bg-transparent border-slate-700 text-white outline-none appearance-none px-4 py-2 pr-8 rounded-md font-vcr min-w-[250px]"
                  value={selectedId}
                  onChange={async (e) =>
                    await handleTokenChange(parseInt(e.target.value))
                  }
                >
                  <option value="">TokenID</option>
                  {hmdt?.map((h, i) => {
                    return (
                      <option key={h.edition} value={Number(h.edition)}>
                        {h.edition}
                      </option>
                    );
                  })}
                </select>
              </span>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="selected HMDT"
                  className="w-[40%] aspect-square"
                />
              )}
              {tokenClaimAmount && (
                <span className="flex justify-center items-center w-full lg:w-[70%]">
                  <label className="font-vcr mr-[5px]">Claim Amount: </label>
                  <span className="font-vcr text-orange-400">
                    {tokenClaimAmount} HP
                  </span>
                </span>
              )}
              <div className="w-full flex flex-col items-center justify-center">
                <input
                  type="text"
                  placeholder="Enter BTC Address"
                  className="h-[45px] w-[250px] md:w-[400px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
                  onChange={(e) => setWallet(e.target.value)}
                  value={btcWallet}
                />
              </div>
              <motion.button
                type="button"
                aria-label="Add BTC Wallet Button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-[1.5rem] py-[.75rem] bg-slate-700 text-white text-vcr w-[70%] md:w-[40%] text-center font-vcr"
                onClick={async () => await handleBtcWallet(btcWallet)}
              >
                Set BTC Address
              </motion.button>
              <div className="w-full flex flex-col justify-center items-center">
                {selectedNft && selectedNft.claimStatus === "unclaimed" && (
                  <MainButton
                    disabled={user?.btcWallet === ""}
                    onClick={handleInitClaim}
                  >
                    Start Claim
                  </MainButton>
                )}
                {selectedNft && selectedNft.claimStatus === "pending" && (
                  <MainButton
                    disabled={user?.btcWallet === ""}
                    onClick={handleStartClaim}
                  >
                    Claim
                  </MainButton>
                )}
                {selectedNft && selectedNft.claimStatus === "claiming" && (
                  <span className="font-vcr">
                    Status - <span className="text-orange-400">Claiming</span>
                  </span>
                )}
                {selectedNft && selectedNft.claimStatus === "claimed" && (
                  <span className="font-vcr">
                    Status - <span className="text-orange-400">Claimed</span>
                  </span>
                )}
                {user?.btcWallet === "" && (
                  <span className="font-vcr mt-[5px]">
                    BTC Wallet needs to be set before starting claim
                  </span>
                )}
                <ResponseMessage
                  error={errorMessage}
                  success={successMessage}
                />
              </div>
            </div>
          </div>
          <FAQ faqQuestions={[]} title="Claim Ordinal FAQs" />
        </div>
      ) : (
        <div className="border-1 border-orange-400 rounded flex flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.25rem]">
          <NoAccount />
        </div>
      )}
    </div>
  );
};

export default ordinalclaim;
