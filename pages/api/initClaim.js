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
    console.log("AFTER GETTING DEBUG");
    if (!debug) {
      console.log("ERROR: THERE IS NO DEBUG");
      res
        .status(500)
        .json({ RangeError: `No debug found for token id: ${tokenId}` });
      return;
    }
    if (debug.claimStatus === "pending") {
      console.log("ERROR: CLAIM STATUS ALREADY PENDING");
      res
        .status(500)
        .json({ error: `Claim has already started for tokenId: ${tokenId}` });
      return;
    }
    let [tokenOwner] = await getOwnerOfToken(tokenId);
    //NEED TO CHANGE ADDRESS ARG TO tokenOwner

    // let isTokenOwner = checkIfOwner(user, tokenOwner);
    let isTokenOwner = true;
    console.log("IS TOKEN OWNER: ", isTokenOwner);
    if (!isTokenOwner) {
      console.log("ERROR: IS NOT TOKEN OWNER");
      res
        .status(400)
        .json({ error: `User is not the owner of token ${tokenId}` });
      return;
    }
    let updateDebug = await updateDebugStatusToPending(tokenId);
    console.log("UPDATED DEBUG", updateDebug);
    res.send(updateDebug);
  } catch (err) {
    console.error(err);
    console.log(err.message);
    if (err.message === "Token expired" || err.message === "Token malformed") {
      res.status(401).json(err);
    }
    res.status(500).json({ error: err.message });
  }
}

let updateDebugStatusToPending = async (id) => {
  try {
    const updatedDebug = await Debug.findOneAndUpdate(
      { id },
      { $set: { claimStatus: "pending" } },
      { new: true }
    );
    return updatedDebug;
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
