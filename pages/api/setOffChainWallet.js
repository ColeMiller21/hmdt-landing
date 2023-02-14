const Web3Token = require("web3-token");
const { getUserNFTCount } = require("../../utils/dbHelper");
import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.cookies;

  const { offChainWallet } = req.body;
  try {
    await connectMongo();
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    let updatedUser = await setOffChainWallet(address, offChainWallet);
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    console.log(err.message);
    if (err.message === "Token expired" || err.message === "Token malformed") {
      res.status(401).send(err);
    }
    res.status(500).send(err);
  }
}

const setOffChainWallet = async (address, offChainWallet) => {
  let searchAddress = new RegExp(`${address}`, "i");
  let updatedUser = await User.findOneAndUpdate(
    {
      $or: [
        { address: searchAddress },
        { designatedAddress: searchAddress },
        { offChainWallet: searchAddress },
      ],
    },
    { $set: { offChainWallet } },
    { new: true }
  );
  console.log(updatedUser);
  updatedUser = {
    ...updatedUser._doc,
    nftCount: await getUserNFTCount(updatedUser._doc.address),
  };
  console.log(updatedUser);
  return updatedUser;
};
