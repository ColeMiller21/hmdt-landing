const Web3Token = require("web3-token");
const { getUserNFTCount } = require("../../utils/dbHelper");
import connectMongo from "../../lib/connectMongo";
import Debug from "../../lib/models/Debug";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { token } = req.cookies;
  const { id } = req.query;
  if (!id) {
    res.status(400).send({ message: "Query must contain an id" });
  }
  try {
    await connectMongo();
    const { address, body } = await Web3Token.verify(token);
    console.log({ address }, { body });
    let debug = await getClaimAmount(id);
    res.status(200).send(debug);
  } catch (err) {
    console.error(err);
    console.log(err.message);
    if (err.message === "Token expired" || err.message === "Token malformed") {
      res.status(401).send(err);
    }
    res.status(500).send(err);
  }
}

const getClaimAmount = async (id) => {
  try {
    const debug = await Debug.findOne({ id }).lean();
    return debug;
  } catch (err) {
    throw new Error(`No entry found with address: ${address}`);
  }
};
