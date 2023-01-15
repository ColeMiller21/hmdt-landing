import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { secret } = req.headers;
  const { user } = req.body;

  if (!secret || secret !== process.env.HMDT_API_KEY) {
    return res.status(403).send({ message: "NOT AN AUTHORIZED DEBBUGER" });
  }

  if (method !== "PUT")
    res.status(404).send({ message: "This method is not supported!" });
  try {
    await connectMongo();
    if (!user) throw new Error("No user found in request body");
    let updatedUser = await enrollUser(user);
    res
      .status(200)
      .send({ message: "Successfully updated user!", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

const enrollUser = async (user) => {
  try {
    const filter = {
      $or: [{ address: user?.address }],
    };
    let result = await User.findOneAndUpdate(filter, user, { new: true });
    return result;
  } catch (err) {
    throw new Error(err);
  }
};