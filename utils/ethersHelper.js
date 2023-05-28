import { ethers } from "ethers";
import { getContract } from "./getContract";

export const formatBigNumber = (hex) => {
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
  var first = address.slice(0, 4);
  var last = address.slice(-6);
  return `${first}....${last}`;
};

export const isValidAddress = (address) => {
  return ethers.utils.isAddress(address);
};

export const ALCHEMY_PROVIDER = new ethers.providers.AlchemyProvider(
  "mainnet",
  process.env.NEXT_PUBLIC_ALCHEMY_ID
);

export const GOERLI_PROVIDER = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.NEXT_PUBLIC_ALCHEMY_ID
);
