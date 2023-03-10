import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { IoInformationCircleOutline } from "react-icons/io5";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ResponseMessage from "./ResponseMessage";
import MainButton from "./MainButton";
import { IconContext } from "react-icons";
import { Link as ScrollLink } from "react-scroll";

const UserActionSection = ({ submitBid }) => {
  let { user, validUser } = useContext(UserContext);
  const [bidAmount, setBidAmount] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const userSubmit = async (e) => {
    e.preventDefault();
    let { success, message } = await submitBid(bidAmount);
    if (success) {
      setSuccessText(message);
      setBidAmount(0);
      setTimeout(() => {
        setSuccessText(null);
      }, 2500);
    } else {
      setErrorText(message);
      setTimeout(() => {
        setErrorText(null);
      }, 2500);
    }
  };

  useEffect(() => {}, [validUser, user]);
  return (
    <div className="border-1 border-slate-700 rounded flex flex-col w-[90%] lg:w-[70%] px-[2rem] py-[1.25rem]">
      {validUser && user?.nftCount > 0 ? (
        <div className="flex flex-col w-full lg:gap-[1.5rem]">
          <h2 className="font-pixel text-[4vw] md:text-[2vw] text-center mb-[1rem] flex justify-center items-center">
            Bidding{" "}
            <span className="ml-[3px] cursor-pointer">
              <ScrollLink
                activeClass="active"
                to="faqs"
                spy={true}
                smooth={true}
                offset={0}
                duration={300}
              >
                <IconContext.Provider
                  value={{
                    color: "#fb923c",
                    size: "2rem",
                    className: "",
                  }}
                >
                  <IoInformationCircleOutline />
                </IconContext.Provider>
              </ScrollLink>
            </span>
          </h2>
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center ">
            <div className="font-vcr">
              <h6 className="mt-[1rem] lg:mt-0">
                Balance of $HP:{" "}
                <span className="text-orange-500">
                  {user?.totalBalance || 0}
                </span>
              </h6>
              <h6>
                Current Bid:{" "}
                <span className="text-orange-500">
                  {user?.bidAmount || "N/A"}
                </span>{" "}
              </h6>
            </div>
            <ConnectButton showBalance={false} chainStatus="none" />
          </div>
          <div className="flex flex-col items-center gap-[1rem] py-[1rem] ">
            <input
              type="number"
              placeholder="Place Bid"
              className="h-[45px] border-2 border-slate-700 rounded pl-2 text-[#FAFAFA] bg-[#141414] overflow-hidden font-vcr"
              onChange={(e) => setBidAmount(e.target.value)}
              value={bidAmount}
            />

            <MainButton
              onClick={userSubmit}
              ariaLabel="Place Bid"
              width="w-[80%]"
            >
              Submit Bid
            </MainButton>
            <ResponseMessage error={errorText} success={successText} />
          </div>
        </div>
      ) : (
        // <NoAccount />
        <>
          Inactive User Cannot Bid is not holding an nft or associated with a
          wallet who is. Please check Profile if you would like to check or
          transfer remaining HP
        </>
      )}
    </div>
  );
};

export default UserActionSection;
