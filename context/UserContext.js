import React, { createContext, useEffect, useState } from "react";
import { getUser } from "../utils/dbHelper";
import axios from "axios";
import Web3Token from "web3-token";
import { getDisplayName, getUserNFTCount } from "../utils/dbHelper";
import { useAccount, useProvider, useSigner, useNetwork } from "wagmi";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const storedUser = sessionStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [status, setStatus] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const headers = {
    token,
  };

  // useEffect(() => {
  //   console.log("IN INIT");
  //   if (!isConnected) {
  //     console.log("not connected");
  //     setToken(null);
  //     localStorage.removeItem("token");
  //     setStatus(0);
  //     return;
  //   }
  //   async function fetchData() {
  //     // here you can use your own endpoint and method to get the user
  //     try {
  //       if (!token) {
  //         console.log(
  //           "No token do a function to set the user to null and have them re sign a message"
  //         );
  //         await triggerSignAndGenerateToken(signer);
  //         console.log("DONE WITH GETTING TOKEN");
  //       }
  //       console.log("VALIDATING....");
  //       let u = await validateAndGetUser();
  //       console.log("GOT USER", u);
  //       setUser(u);
  //       setStatus(null);
  //       setLoadingUser(true);
  //       let user = await getUser(address);
  //       setUser(user);
  //       setLoadingUser(false);
  //       sessionStorage.setItem("user", JSON.stringify(user));
  //     } catch (err) {
  //       console.log("CAUGHT IN VALIDATE USER: ", err);
  //       console.error(err);
  //       setLoadingUser(false);
  //     }
  //   }
  //   fetchData();
  // }, [isConnected, signer]);

  // useEffect(() => {
  //   console.log("ADDRESS CHANGE");

  //   const checkAddressChange = (add) => {
  //     if (add === user?.address || add === user?.offChainAddress) {
  //       console.log("Valid address");
  //       return;
  //     }
  //     //1 status equals connected but no valid token
  //     console.log("Not a valid address setting Status to 1 to sign in");
  //     setStatus(1);
  //   };
  //   checkAddressChange(address);
  // }, [address]);

  const triggerSignAndGenerateToken = async () => {
    console.log({ signer });
    if (!signer) return;
    const t = await Web3Token.sign(
      async (msg) => await signer.signMessage(msg),
      {
        domain: "helpmedebugthis.com",
        statement:
          "I am authorizing the use of my address to bid and enroll using $HP",
        expires_in: "1 hour",
      }
    );
    console.log("NEW TOKEN: ", { t });
    setToken(t);
    localStorage.setItem("token", t);
  };

  const validateAndGetUser = async () => {
    let { data } = await axios.get("/api/validateAndGetUser", { headers });
    return data;
  };

  const updateBid = async () => {
    if (!token) {
      console.log("NO TOKEN: ", { token });
      return;
    }
    let { data } = await axios.post(
      "/api/updateBid",
      { bidAmount: 11 },
      { headers }
    );
    setUser(data);
  };

  const handleUserEnrollment = async () => {
    if (!token) {
      console.log("NO TOKEN: ", { token });
      return;
    }
    try {
      let { data } = await axios.post(
        "/api/enrollUser",
        { enroll: false },
        { headers }
      );
      setUser(data);
    } catch (error) {
      console.error("ERROR IN USER ENROLLMENT: ", error);
    }
  };

  const handleError = async () => {
    //need to read the message from here
    //if(message === "Token expired") clear token and set status to 1
  };

  return (
    <UserContext.Provider
      value={{ user, loadingUser, status, handleUserEnrollment, updateBid }}
    >
      {children}
    </UserContext.Provider>
  );
}
