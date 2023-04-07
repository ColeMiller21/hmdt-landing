import Debug from "../../lib/models/Debug";
import connectMongo from "../../lib/connectMongo";

export default async function handler(req, res) {
  let { id } = req.query;
  try {
    await connectMongo();
    let debug = await getDebug(id);

    res.status(200).send(debug);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
    res.status(500).send(err);
  }
}

const getDebug = async (id) => {
  try {
    let debug = await Debug.findOne({
      id,
    }).lean();
    return debug;
  } catch (err) {
    throw new Error(err.message);
  }
};
