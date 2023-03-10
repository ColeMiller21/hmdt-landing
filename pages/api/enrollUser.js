const Web3Token = require("web3-token");
const { getUserNFTCount } = require("../../utils/dbHelper");
import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.cookies;
  const { enroll, bidAmount, totalBalance } = req.body.payload;
  try {
    await connectMongo();
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    let updatedUser = await enrollUser(
      address,
      enroll,
      totalBalance,
      bidAmount
    );
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

const enrollUser = async (address, enroll, totalBalance, bidAmount) => {
  let searchAddress = new RegExp(`${address}`, "i");
  let insertObj = enroll
    ? { enrolled: enroll, bidAmount, totalBalance }
    : { enrolled: enroll, totalBalance };
  console.log(insertObj);
  let updatedUser = await User.findOneAndUpdate(
    {
      $or: [
        { address: searchAddress },
        { designatedAddress: searchAddress },
        { offChainWallet: searchAddress },
      ],
    },
    { $set: insertObj },
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
