const Web3Token = require("web3-token");
import User from "../../lib/models/User";
import connectMongo from "../../lib/connectMongo";

export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.headers;

  if (method !== "GET") res.status(400).send({ message: "Read only route" });
  try {
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    await connectMongo();
    let user = await getUser(address);
    if (!user) res.send(null);
    res.send(user);
  } catch (err) {
    console.error(err);
    console.log(err);
    if (
      err?.stack.includes("Token expired") ||
      err?.stack.includes("Token malformed")
    ) {
      res.status(401).send(err);
    }
    res.status(500).send(err);
  }
}

const getUser = async (address) => {
  let searchAddress = new RegExp(`${address}`, "i");
  const user = await User.findOne({
    $or: [
      { address: searchAddress },
      { designatedAddress: searchAddress },
      { offChainWallet: searchAddress },
    ],
  }).lean();
  return user;
};
