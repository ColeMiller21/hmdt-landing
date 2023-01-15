import { ethers } from "ethers";
import { getContract } from "./getContract";

export const formatBigNumber = (hex) => {
  console.log(hex);
  let bigNumber = ethers.BigNumber.from(hex);
  const number = bigNumber.toNumber();
  return number;
};

export const reverseResolveAddress = async (provider, address) => {
  let contract = getContract(provider, "ens");
  let name = await contract.functions.getNames([address]);
  if (name[0][0] === "") {
    return address;
  }
  return name[0][0];
};

export const formatAddress = (address) => {
  if (!address || address?.includes(".eth")) return;
  return `${address.substring(0, 5)}....${address.substring(36, 42)}`;
};

export const isValidAddress = (address) => {
  return ethers.utils.isAddress(address);
};
