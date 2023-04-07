import connectMongo from "../../lib/connectMongo";
import User from "../../lib/models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { secret } = req.headers;
  const { user } = req.body;

  try {
    switch (method) {
      case "GET":
        // call get user
        let address = req.query.address;
        if (address) {
          const result = await getUser(address);
          if (result) {
            res.send({ user: result });
          } else {
            res.send({ user: null });
          }
        } else {
          const result = await User.find({}).sort({ bidAmount: -1 }).limit(12);
          res.send({ users: result });
        }
        break;
      case "POST":
        if (!secret || secret !== process.env.HMDT_API_KEY) {
          return res
            .status(403)
            .send({ message: "NOT AN AUTHORIZED DEBBUGER" });
        }
        if (!user) throw new Error("No user found in request body");
        let createdUser = await createUser(user);
        res
          .status(200)
          .send({ message: "Successfully created user!", user: createdUser });
        break;
      case "PUT":
        if (!secret || secret !== process.env.HMDT_API_KEY) {
          return res
            .status(403)
            .send({ message: "NOT AN AUTHORIZED DEBBUGER" });
        }
        if (!user) throw new Error("No user found in request body");
        let updatedUser = await updateUser(user);
        res.send({ message: "Successfully updated user!", user: updatedUser });
        break;
      default:
        res.status(400).send({ message: "THIS METHOD IS NOT SUPPORTED" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

const getUser = async (address) => {
  try {
    await connectMongo();
    const user = await User.findOne({
      $or: [
        { address: address },
        { designatedAddress: address },
        { offChainWallet: address },
      ],
    }).lean();
    return user;
  } catch (err) {
    throw new Error(`No entry found with address: ${address}`);
  }
};

const createUser = async (user) => {
  try {
    await connectMongo();
    const newUser = new User(user);
    let save = await newUser.save();
    return save;
  } catch (err) {
    throw new Error(`Error when trying to create user: ${err}`);
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
    console.log(JSON.parse(err));
    throw new Error(err);
  }
};
