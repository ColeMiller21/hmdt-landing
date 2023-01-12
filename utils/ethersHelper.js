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
