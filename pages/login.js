import React, { useContext, useEffect, useState } from "react";
import Web3Token from "web3-token";
import { useSigner, useAccount } from "wagmi";
import { UserContext } from "../context/UserContext";
import NotConnected from "../components/NotConnected";
import cookie from "js-cookie";
import axios from "axios";
import { SessionContext } from "../context/SessionContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UserActionSection from "../components/UserActionSection";

export async function getServerSideProps({ req, res }) {
  let { token } = req.cookies;
  if (!token) {
    console.log("THERE IS NO TOKEN");
    return {
      props: { token: null },
    };
  }
  try {
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
  } catch (err) {
    if (err.message === "Token expired" || err.message === "Token malformed") {
      return {
        props: { token: null },
      };
    }
  }

  return {
    props: { token: req.cookies.token || null },
  };
}

const login = ({ token }) => {
  const { isConnected } = useAccount();
  const { session, setSession, handleDisconnect } = useContext(SessionContext);
  const {
    user,
    validUser,
    loadingUser,
    handleUserEnrollment,
    validateAndGetUser,
    updateBid,
  } = useContext(UserContext);
  const { data: signer, isError, isLoading } = useSigner();
  const testToken = async () => {
    try {
      let data = await axios.get("/api/testToken");
      console.log(data);
    } catch (err) {
      console.log(err);
      console.log(err.response.status);
      if (err.response.status === 401) {
        console.log("THIS IS TOKEN EXPIRED NEEDS TO RE-SIGN IN");
        handleDisconnect();
        return;
      }
    }
  };

  useEffect(() => {
    if (!user) return;
    console.log({ user });
    console.log({ session });
    console.log({ validUser });
  }, [session, validUser]);

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center">
      <div className="flex flex-col gap-[2rem]">
        <button onClick={testToken}>Test Token</button>
        {isConnected && validUser && session ? (
          <UserActionSection submitBid={updateBid} />
        ) : (
          <NotConnected />
        )}

        <ConnectButton />
      </div>
    </div>
  );
};

export default login;
