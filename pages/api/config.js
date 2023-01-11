import connectMongo from "../../lib/connectMongo";
import Config from "../../lib/models/Config";

export default async function handler(req, res) {
  const method = req.method;
  const { secret } = req.headers;
  const { config } = req.body;

  console.log(req.body);

  // if (!secret || secret !== process.env.HMDT_API_SECRET) {
  //   return res.status(403).send({ message: "NOT AN AUTHORIZED DEBBUGER" });
  // }
  console.log("BODY -- ", req.body);
  console.log("--METHOD USED-- ", method);
  try {
    switch (method) {
      case "GET":
        const returnedConfigs = await getAllConfigs();
        if (returnedConfig) {
          res.status(200).send({ config: returnedConfigs });
        } else {
          res.status(200).send({ user: null });
        }
        break;
      case "POST":
        if (!config) throw new Error("No user found in request body");
        let createdConfig = await createConfig(config);
        console.log("CREATED USER: ", createdConfig);
        res.status(200).send({
          message: "Successfully created user!",
          config: createdConfig,
        });
        break;
      case "PUT":
        // call update user
        if (!config) throw new Error("No user found in request body");
        let updatedConfig = await updateConfig(config);
        res.status(200).send({
          message: "Successfully updated user!",
          config: updatedConfig,
        });
        break;
      default:
        res.status(400).send({ message: "THIS METHOD IS NOT SUPPORTED" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

const getAllConfigs = async () => {
  try {
    await connectMongo();
    const config = await Config.find();
    return config;
  } catch (err) {
    throw new Error(`No config found`);
  }
};

const createConfig = async (config) => {
  try {
    await connectMongo();
    const newConfig = new Config(config);
    let save = await newConfig.save();
    return save;
  } catch (err) {
    throw new Error(`Error when trying to create user: ${err}`);
  }
};

const updateConfig = async (config) => {
  try {
    const filter = {
      page: config.page,
    };

    // const result = await User.updateOne(filter, update);
    let result = await User.findOneAndUpdate(
      filter,
      { ...config },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
