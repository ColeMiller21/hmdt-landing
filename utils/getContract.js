import { ethers } from "ethers";
import ABI from "../public/files/abi.json";
const main = "0x5cD821560212E72333BC03E5D0c2Ed3059a8d884";

export const getContract = (provider, type) => {
  if (!provider) return;
  let contract = new ethers.Contract(main, ABI, provider);
  return contract;
};
