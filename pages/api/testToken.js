const Web3Token = require("web3-token");
import User from "../../lib/models/User";
import connectMongo from "../../lib/connectMongo";

export default async function handler(req, res) {
  const method = req.method;
  console.log(req.headers);

  try {
    // getting token from authorization header ... for example
    const { token } = req.headers;
    console.log(token);
    console.log("GOT TOKEN");
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    // now you can find that user by his address
    // (better to do it case insensitive)
    let currentTime = new Date();
    console.log({ currentTime });

    await connectMongo();
    let user = await getUser(address);
    console.log({ user });
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

const getUser = async (address) => {
  try {
    await connectMongo();
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
