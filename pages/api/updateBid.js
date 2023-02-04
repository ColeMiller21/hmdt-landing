const Web3Token = require("web3-token");
import User from "../../lib/models/User";
import connectMongo from "../../lib/connectMongo";

export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.headers;
  const { bidAmount } = req.body;

  try {
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    await connectMongo();
    let updated = await updateBid(address, bidAmount);
    console.log({ updated });
    res.send(updated);
  } catch (err) {
    console.log("CAUGHT ERROR IN CATCH");
    console.error(err);
    res.status(500).send(err);
  }
}

const updateBid = async (address, bidAmount) => {
  let searchAddress = new RegExp(`${address}`, "i");
  const updatedUser = await User.findOneAndUpdate(
    { $or: [{ address: searchAddress }, { designatedAddress: searchAddress }] },
    { $set: { bidAmount } },
    { new: true }
  );
  return updatedUser;
};
