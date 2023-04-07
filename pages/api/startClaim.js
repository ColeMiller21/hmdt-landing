const Web3Token = require("web3-token");
const {
  getUserNFTCount,
  getOwnerOfToken,
  getOwnerOfGift,
} = require("../../utils/dbHelper");
import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";
import Debug from "../../lib/models/Debug";

export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.cookies;
  const { tokenId } = req.body;
  try {
    await connectMongo();
    const { address, body } = await Web3Token.verify(token);
    //getting user by address
    let user = await getUser(address);
    //getting nft by tokenid
    let debug = await getDebug(tokenId);
    if (!debug) {
      console.log("ERROR: NO DEBUG FOUND");
      res
        .status(500)
        .send({ message: `No debug found for token id: ${tokenId}` });
      return;
    }
    if (debug.claimStatus === "claiming" || debug.claimStatus === "unclaimed") {
      console.log("ERROR: DEBUG STATUS IS NOT CORRECT");
      res
        .status(500)
        .send({ message: `Claim has already started for tokenId: ${tokenId}` });
      return;
    }
    //checking available balance
    let availableBalance = user?.totalBalance - user?.bidAmount;
    if (availableBalance < debug.claimAmount) {
      console.log("ERROR: NOT ENOUGH HP");
      res
        .status(400)
        .send({ message: "User does not have enough HP to claim" });
      return;
    }
    let [tokenOwner] = await getOwnerOfToken(tokenId);
    //need to take out address and move in tokenOwner
    let isTokenOwner = checkIfOwner(user, tokenOWner);
    if (!isTokenOwner) {
      console.log("ERROR: IS NOT OWNER");
      res
        .status(400)
        .send({ message: `User is not the owner of token ${tokenId}` });
      return;
    }
    let updateDebug = await updateDebugStatusToPending(tokenId);
    let updatedUser = await updateOwnerBalance(address, debug.claimAmount);
    res.send({ user: updatedUser, nft: updateDebug });
  } catch (err) {
    console.error(err);
    console.log(err.message);
    if (err.message === "Token expired" || err.message === "Token malformed") {
      res.status(401).send(err);
    }
    res.status(500).send(err.message);
  }
}

let updateDebugStatusToPending = async (id) => {
  try {
    const updatedDebug = await Debug.findOneAndUpdate(
      { id },
      { $set: { claimStatus: "claiming" } },
      { new: true }
    );
    return updatedDebug;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateOwnerBalance = async (address, claimAmount) => {
  try {
    let searchAddress = new RegExp(`${address}`, "i");
    let user = await User.findOneAndUpdate(
      { address: searchAddress },
      { $inc: { totalBalance: -claimAmount } },
      { new: true }
    );
    let updatedUser = {
      ...user._doc,
      nftCount: await getUserNFTCount(user._doc.address),
    };
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

const checkIfOwner = (user, tokenOwner) => {
  let isOwner = false;
  for (const key in user) {
    if (typeof user[key] === "string") {
      if (user[key].toLowerCase() === tokenOwner.toLowerCase()) {
        isOwner = true;
        break;
      }
    }
  }
  return isOwner;
};

const getDebug = async (id) => {
  try {
    let debug = await Debug.findOne({
      id,
    }).lean();
    console.log("DEBUG", debug);
    return debug;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUser = async (address) => {
  try {
    let searchAddress = new RegExp(`${address}`, "i");
    console.log(searchAddress);
    let user = await User.findOne({
      $or: [
        { address: searchAddress },
        { designatedAddress: searchAddress },
        { offChainWallet: searchAddress },
      ],
    }).lean();
    return user;
  } catch (err) {
    throw new Error(`No entry found with address: ${address}`);
  }
};
