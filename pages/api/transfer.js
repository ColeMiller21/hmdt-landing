import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { secret } = req.headers;
  const { transferPayload } = req.body;
  console.log(req.body);
  console.log(transferPayload);

  if (!secret || secret !== process.env.HMDT_API_KEY) {
    return res.status(403).send({ message: "NOT AN AUTHORIZED DEBBUGER" });
  }

  if (method !== "POST")
    res.status(404).send({ message: "This method is not supported!" });
  try {
    await connectMongo();
    if (!transferPayload) throw new Error("No payload found in request body");
    let result = await transferAmount(
      transferPayload.transferAmount,
      transferPayload.transferToAddress
    );
    if (!result) {
      throw new Error("Transfer address is not registered as HMDT holder");
    }
    let updatedUser = await updateUser(transferPayload.user);
    res.status(200).send({
      message: "Successfully transferred and updated user balance",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const transferAmount = async (transferAmount, transferTo) => {
  try {
    const filter = {
      $or: [{ address: transferTo }],
    };
    let result = await User.findOneAndUpdate(
      filter,
      { $inc: { totalBalance: transferAmount } },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const updateUser = async (user) => {
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
