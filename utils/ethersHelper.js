import { ethers } from "ethers";

export const formatBigNumber = (hex) => {
  console.log(hex);
  let bigNumber = ethers.BigNumber.from(hex);
  const number = bigNumber.toNumber();
  return number;
};
