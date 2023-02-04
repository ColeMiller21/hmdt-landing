const Web3Token = require("web3-token");
import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { token, secret } = req.headers;
  const { enroll } = req.body;
  console.log(method);
  if (secret && secret === process.env.HMDT_API_KEY) {
    //do anything you want
  }

  try {
    await connectMongo();
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    let updatedUser = await enrollUser(address, enroll);
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

const enrollUser = async (address, enroll) => {
  let searchAddress = new RegExp(`${address}`, "i");
  const updatedUser = await User.findOneAndUpdate(
    { $or: [{ address: searchAddress }, { designatedAddress: searchAddress }] },
    { $set: { enrolled: enroll } },
    { new: true }
  );
  return updatedUser;
};
