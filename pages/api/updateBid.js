const Web3Token = require("web3-token");
const { getUserNFTCount } = require("../../utils/dbHelper");
import User from "../../lib/models/User";
import connectMongo from "../../lib/connectMongo";

export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.cookies;
  const { bidAmount } = req.body;

  try {
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    await connectMongo();
    let updated = await updateBid(address, bidAmount);
    res.send(updated);
  } catch (err) {
    if (err.message === "Token expired" || err.message === "Token malformed") {
      res.status(401).send(err);
    }
    console.error(err);
    res.status(500).send(err.message);
  }
}

const updateBid = async (address, bidAmount) => {
  let searchAddress = new RegExp(`${address}`, "i");
  let updatedUser = await User.findOneAndUpdate(
    {
      $or: [
        { address: searchAddress },
        { designatedAddress: searchAddress },
        { offChainWallet: searchAddress },
      ],
    },
    { $set: { bidAmount } },
    { new: true }
  );
  updatedUser = {
    ...updatedUser._doc,
    nftCount: await getUserNFTCount(updatedUser._doc.address),
  };
  return updatedUser;
};
