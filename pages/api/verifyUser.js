const { getUserNFTCount } = require("../../utils/dbHelper");
import User from "../../lib/models/User";
import connectMongo from "../../lib/connectMongo";

const defaultUser = {
  totalBalance: 0,
  offChainWallet: "",
  designatedAddress: "",
};

export default async function handler(req, res) {
  const method = req.method;
  if (method !== "POST") res.status(400).send({ message: "WRONG HTTP METHOD" });
  let { address } = req.body;

  try {
    await connectMongo();
    let user = await getUser(address);
    let nftCount = await getUserNFTCount(address);
    if (!user && nftCount === 0) {
      res.send(false);
    } else if (!user && nftCount > 0) {
      let newUser = new User({ ...defaultUser, address });
      let returnedNew = await User.create(newUser, { new: true });
      res.send(true);
    }
    res.send(true);
  } catch (err) {
    console.error(err);
    if (err.message === "Token expired" || err.message === "Token malformed") {
      res.status(401).send(err);
    }
    res.status(500).send(err);
  }
}

const getUser = async (address) => {
  try {
    let searchAddress = new RegExp(`${address}`, "i");
    const user = await User.findOne({
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
