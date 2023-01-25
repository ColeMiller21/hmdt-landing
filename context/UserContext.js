import React, { createContext, useEffect, useState } from "react";
import { getUser } from "../utils/dbHelper";
import axios from "axios";
import { useAccount } from "wagmi";
import { getDisplayName, getUserNFTCount } from "../utils/dbHelper";

export const UserContext = createContext();

const headers = {
  secret: process.env.NEXT_PUBLIC_HMDT_API_KEY,
};

export function UserProvider({ children }) {
  const { address, isConnected } = useAccount();
  const storedUser = sessionStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // here you can use your own endpoint and method to get the user
      try {
        setLoadingUser(true);
        let user = await getUser(address);
        setUser(user);
        setLoadingUser(false);
        sessionStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.error(err);
        setLoadingUser(false);
      }
    }
    fetchData();
  }, [isConnected, address]);

  const updateUser = async (payload) => {
    console.log(payload);
    try {
      setLoadingUser(true);
      //update the current user
      let { data } = await axios.put(
        "/api/user",
        { user: payload },
        { headers }
      );
      let newUser = {
        ...data.user,
        nftCount: await getUserNFTCount(data.user?.address),
        displayName: await getDisplayName(data.user?.address),
      };
      setUser(newUser);
      setLoadingUser(false);
      sessionStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error(error);
      setLoadingUser(false);
      throw new Error(error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}
