import { ethers } from "ethers";
import hpAbi from "../public/files/hpAbi.json";
const hpAddress = "0x5cD821560212E72333BC03E5D0c2Ed3059a8d884";
import hmdtAbi from "../public/files/hmdtAbi.json";
const hmdtAddress = "0xdf0F0A5508Aa4f506e5bDC8C45C8879E6E80d3e4";

export const getContract = (provider, type) => {
  let contract;
  switch (type) {
    case "hmdt":
      contract = new ethers.Contract(hmdtAddress, hmdtAbi, provider);
      break;
    case "hp":
      contract = new ethers.Contract(hpAddress, hpAbi, provider);
      break;
    default:
      throw new Error("No contract for that type.");
  }
  return contract;
};
