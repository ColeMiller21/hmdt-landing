import React, { createContext, useEffect, useState } from "react";
import { useSigner, useAccount } from "wagmi";
import cookie from "js-cookie";
import Web3Token from "web3-token";
import axios from "axios";

export const SessionContext = createContext();

export function SessionProvider({ children }) {
  const { data: signer } = useSigner();
  const [session, setSession] = useState(cookie.get("token") || null);
  const { address, isConnected } = useAccount();
  const [isValidUser, setIsValidUser] = useState(false);

  const validateSession = async () => {
    try {
      await Web3Token.verify(session);
      let { data: isValid } = await axios.post("/api/verifyUser", { address });
      console.log("VALID SESSION: ", isValid);
    } catch (err) {
      setSession(null);
    }
  };

  const handleLogIn = async (remember) => {
    // generating a token with 1 day of expiration time
    let expiration = "2 hours";
    if (remember) expiration = "12 hours";

    try {
      const token = await Web3Token.sign(
        async (msg) => {
          try {
            return await signer.signMessage(msg);
          } catch (err) {
            const { reason } = err;
            if (reason === "unknown account #0") {
              return console.log(
                "Have you unlocked metamask and are connected to this page?"
              );
            }

            console.log(err.toString());
          }
        },
        {
          domain: "helpmedebugthis.com",
          statement:
            "Hello Debogger, By signing this message you are authorizing that you are the user of the connected address to communicate with the API.",
          expires_in: expiration,
        }
      );
      if (!token) {
        console.log("SOMETHING WENT WRONG WHEN GETTING TOKEN");
        return;
      }
      setSession(token);
      cookie.set("token", token);
      return;
    } catch (err) {
      console.log(err);
    }
  };

  const handleDisconnect = () => {
    cookie.remove("token");
    setSession(null);
  };

  useEffect(() => {
    (async () => {
      validateSession();
    })();
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        isValidUser,
        setSession,
        handleLogIn,
        handleDisconnect,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
