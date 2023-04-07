import { getContract } from "./getContract";
import {
  formatBigNumber,
  formatAddress,
  isValidAddress,
  reverseResolveAddress,
  ALCHEMY_PROVIDER,
} from "../utils/ethersHelper";
import axios from "axios";

const headers = {
  secret: process.env.NEXT_PUBLIC_HMDT_API_KEY,
};

// Get the user or create if the address doesnt exist and the user holds HMDT count > 0
const getUser = async (addr) => {
  let { data } = await axios.get(`/api/user?address=${addr}`, { headers });
  let nftCount = await getUserNFTCount(data.user?.address);
  if (!data.user) {
    let nullUserNftCount = await getUserNFTCount(addr);
    if (nullUserNftCount > 0) {
      let { data } = await axios.post(
        "/api/user",
        { user: { address: addr } },
        { headers }
      );
      let nftCount = nullUserNftCount;
      data.user.displayAddress = await getDisplayName(data.user?.address);
      return { ...data.user, nftCount };
    }
    return null;
  }
  data.user.displayAddress = await getDisplayName(data.user?.address);
  return { ...data.user, nftCount };
};

const transferHPFromUser = async (transferPayload) => {
  let { data } = await axios.post(
    "/api/transfer",
    { transferPayload },
    { headers }
  );
  return data;
};

const getTopBidders = async () => {
  let { data } = await axios.get(`/api/user`, { headers });
  return data.users;
};

const getDisplayName = async (address) => {
  let ensName = await reverseResolveAddress(ALCHEMY_PROVIDER, address);
  return ensName;
};

const getUserNFTCount = async (address) => {
  if (!address) return 0;
  let contract = getContract(ALCHEMY_PROVIDER, "hmdt");
  let nftCount = await contract.functions.balanceOf(address);
  nftCount = formatBigNumber(nftCount[0]);
  return nftCount;
};

const getOwnerOfToken = async (tokenId) => {
  let contract = getContract(ALCHEMY_PROVIDER, "hmdt");
  console.log({ tokenId });
  let ownerAddress = await contract.functions.ownerOf(tokenId);
  return ownerAddress;
};

const getOwnerOfGift = async (tokenId) => {
  let contract = getContract(ALCHEMY_PROVIDER, "hmgt");
  console.log({ tokenId });
  let ownerAddress = await contract.functions.ownerOf(tokenId);
  console.log(ownerAddress);
  return ownerAddress;
};

export {
  getUser,
  getUserNFTCount,
  getDisplayName,
  transferHPFromUser,
  getOwnerOfToken,
  getOwnerOfGift,
};
