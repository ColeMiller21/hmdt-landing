const Web3Token = require("web3-token");
const { getUserNFTCount } = require("../../utils/dbHelper");
import User from "../../lib/models/User";
import connectMongo from "../../lib/connectMongo";
export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.cookies;
  const { transferAmount, transferToAddress, totalBalance } =
    req.body.transferPayload;
  console.log(req.body);

  if (method !== "POST")
    res.status(400).send({ message: "This method is not supported!" });
  try {
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    await connectMongo();

    await transferAmountTo(transferAmount, transferToAddress);
    // if (!result) {
    //   throw new Error("Transfer address is not registered as HMDT holder");
    // }
    let updatedUser = await updateUser(address, totalBalance);
    res.status(200).send({
      message: "Successfully transferred and updated user balance",
      user: updatedUser,
    });
  } catch (err) {
    if (err.message === "Token expired" || err.message === "Token malformed") {
      res.status(401).send(err);
    }
    console.error(err);
    res.status(500).send(err.message);
  }
}

const transferAmountTo = async (transferAmount, transferTo) => {
  try {
    const filter = {
      $or: [{ address: transferTo }],
    };
    let result = await User.findOneAndUpdate(
      filter,
      { $inc: { totalBalance: transferAmount } },
      { new: true }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateUser = async (address, totalBalance) => {
  let searchAddress = new RegExp(`${address}`, "i");
  try {
    let updatedUser = await User.findOneAndUpdate(
      {
        $or: [
          { address: searchAddress },
          { designatedAddress: searchAddress },
          { offChainWallet: searchAddress },
        ],
      },
      { $set: { totalBalance } },
      { new: true }
    );
    updatedUser = {
      ...updatedUser._doc,
      nftCount: await getUserNFTCount(updatedUser._doc.address),
    };
    console.log(updatedUser);
    return updatedUser;
  } catch (err) {
    throw new Error(err);
  }
};
