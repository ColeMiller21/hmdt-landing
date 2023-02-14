import React, { createContext, useEffect, useState, useContext } from "react";
import { getUser } from "../utils/dbHelper";
import axios from "axios";
import { useAccount, useProvider, useSigner, useNetwork } from "wagmi";
import { fetchEnsName } from "@wagmi/core";
import { SessionContext } from "./SessionContext";
import { validateBidAmount } from "../utils/bidHelper";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const storedUser = sessionStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const { session, setSession } = useContext(SessionContext);

  useEffect(() => {
    async function fetchData() {
      // here you can use your own endpoint and method to get the user
      try {
        let user = await getUser(address);
        setUser(user);
        setLoadingUser(false);
        sessionStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.log("CAUGHT IN VALIDATE USER: ", err);
        console.error(err);
        setLoadingUser(false);
      }
    }
    fetchData();
  }, [isConnected, signer]);

  useEffect(() => {
    const checkAddressChange = async (add) => {
      if (add === user?.address || add === user?.offChainWallet) {
        setValidUser(true);
        return;
      }
      let { data: isValid } = await axios.post("/api/verifyUser", {
        address: add,
      });
      setValidUser(isValid);
      setSession(null);
      if (!isValid) {
        setValidUser(false);
        setUser(null);
      }
    };
    checkAddressChange(address);
  }, [address]);

  const validateAndGetUser = async () => {
    let { data } = await axios.get("/api/validateAndGetUser");
    console.log("IN GET USER");
    console.log(data);
    return data;
  };

  const updateBid = async (bidAmount) => {
    bidAmount = Math.round(bidAmount);
    let { success, message } = validateBidAmount(bidAmount, user);
    if (!success) {
      return { success, message };
    }
    try {
      let { data } = await axios.post("/api/updateBid", { bidAmount });
      setUser(data);
      return { success: true, message: "Bid Submitted Successfully" };
    } catch (err) {
      if (err.message.includes("401")) {
        setTimeout(() => {
          setSession(null);
        }, 1500);
        return {
          success: false,
          message: "Login expired. Will be prompted to sign in again.",
        };
      }
      return {
        success: false,
        message: err.message,
      };
    }
  };

  const handleUserEnrollment = async (enrollInformation) => {
    try {
      let { data } = await axios.post("/api/enrollUser", {
        payload: enrollInformation,
      });
      setUser(data);
      return {
        success: true,
        message: enrollInformation.enroll
          ? "Successfully enrolled!"
          : "Successfully unenrolled!",
      };
    } catch (err) {
      console.error("ERROR IN USER ENROLLMENT: ", err.message);
      if (err.message.includes("401")) {
        setTimeout(() => {
          setSession(null);
        }, 1500);
        return {
          success: false,
          message: "Login expired. Will be prompted to sign in again.",
        };
      }
      return {
        success: false,
        message: err.message,
      };
    }
  };

  const setOffChainWallet = async (offChainWallet) => {
    try {
      let { data } = await axios.post("/api/setOffChainWallet", {
        offChainWallet,
      });
      setUser(data);
      return {
        success: true,
        message: "Successfully set off chain wallet!",
      };
    } catch (err) {
      console.error("ERROR IN SET OFF CHAIN WALLET: ", err.message);
      if (err.message.includes("401")) {
        setTimeout(() => {
          setSession(null);
        }, 1500);
        return {
          success: false,
          message: "Login expired. Will be prompted to sign in again.",
        };
      }
      return {
        success: false,
        message: err.message,
      };
    }
  };

  const transferHP = async (transferPayload) => {
    try {
      let { data } = await axios.post("/api/transfer", { transferPayload });
      setUser(data.user);
      return { success: true, message: "Successfully transferred HPD!" };
    } catch (err) {
      console.error("ERROR IN TRANSFER: ", err.message);
      if (err.message.includes("401")) {
        setTimeout(() => {
          setSession(null);
        }, 1500);
        return {
          success: false,
          message: "Login expired. Will be prompted to sign in again.",
        };
      }
      return {
        success: false,
        message:
          "500 Error: Ensure transfer to address that is a registered holder of HMDT",
      };
    }
  };

  const handleError = async () => {};

  return (
    <UserContext.Provider
      value={{
        user,
        validUser,
        loadingUser,
        handleUserEnrollment,
        updateBid,
        validateAndGetUser,
        setOffChainWallet,
        transferHP,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
