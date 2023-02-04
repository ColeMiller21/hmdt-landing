import React, { useContext, useEffect } from "react";
import Web3Token from "web3-token";
import { useSigner } from "wagmi";
import { UserContext } from "../context/UserContext";
import NotConnected from "../components/NotConnected";

const login = () => {
  const { user, status, loadingUser, handleUserEnrollment } =
    useContext(UserContext);

  const { data: signer, isError, isLoading } = useSigner();
  // const signer = provider.getSigner();

  const handleLogIn = async () => {
    // generating a token with 1 day of expiration time
    const token = await Web3Token.sign(
      async (msg) => await signer.signMessage(msg),
      {
        domain: "helpmedebugthis.com",
        statement:
          "I am authorizing the use of my address to bid and enroll using $HP",
        expires_in: "1 hour",
      }
    );
    localStorage.setItem("token", token);
    return;
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center">
      <div className="flex flex-col gap-[2rem]">
        <button onClick={handleLogIn}>Sign In</button>
        <button onClick={handleUserEnrollment}>Test Token</button>
        <NotConnected status={status} />
      </div>
    </div>
  );
};

export default login;
