import { ErrorFragment } from "ethers/lib/utils";
import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { secret } = req.headers;
  const { user } = req.body;

  console.log(req.body);

  // if (!secret || secret !== process.env.HMDT_API_SECRET) {
  //   return res.status(403).send({ message: "NOT AN AUTHORIZED DEBBUGER" });
  // }
  console.log("BODY -- ", req.body);
  console.log("--METHOD USED-- ", method);
  if (method !== "PUT")
    res.status(404).send({ message: "This method is not supported!" });
  try {
    // call update user
    if (!user) throw new Error("No user found in request body");
    let updatedUser = await enrollUser(user);
    console.log("UPDATED USER: ", updatedUser);
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
      $or: [
        { address: user?.address },
        { designatedAddress: user?.designatedAddress },
      ],
    };

    let result = await User.findOneAndUpdate(
      filter,
      { enrolled: user?.enrolled },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
