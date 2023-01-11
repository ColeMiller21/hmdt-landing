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
  try {
    switch (method) {
      case "GET":
        // call get user
        let address = req.query.address;
        console.log({ address });
        const returnedUser = await getUser(address);
        if (returnedUser) {
          res.status(200).send({ user: returnedUser });
        } else {
          res.status(200).send({ user: null });
        }
        break;
      case "POST":
        if (!user) throw new Error("No user found in request body");
        console.log(user);
        let createdUser = await createUser(user);
        console.log("CREATED USER: ", createdUser);
        res
          .status(200)
          .send({ message: "Successfully created user!", user: createdUser });
        break;
      case "PUT":
        // call update user
        if (!user) throw new Error("No user found in request body");
        let updatedUser = await updateUser(user);
        console.log("UPDATED USER: ", updatedUser);
        res
          .status(200)
          .send({ message: "Successfully updated user!", user: updatedUser });
        break;
      default:
        res.status(400).send({ message: "THIS METHOD IS NOT SUPPORTED" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

const getUser = async (address) => {
  try {
    await connectMongo();
    const user = await User.findOne({
      $or: [{ address: address }, { designatedAddress: address }],
    });
    console.log("USER ", user);
    return user;
  } catch (err) {
    throw new Error(`No entry found with address: ${address}`);
  }
};

const createUser = async (user) => {
  console.log("User to create", user);
  try {
    await connectMongo();
    const newUser = new User(user);
    let save = await newUser.save();
    console.log(save);
    return save;
  } catch (err) {
    throw new Error(`Error when trying to create user: ${err}`);
  }
};

const updateUser = async (user) => {
  try {
    const filter = {
      $or: [
        { address: user?.address },
        { designatedAddress: user?.designatedAddress },
      ],
    };

    // const result = await User.updateOne(filter, update);
    let result = await User.findOneAndUpdate(
      filter,
      { bidAmount: Number(user?.currentBid) },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
