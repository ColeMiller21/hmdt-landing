import axios from "axios";

const baseUserUrl = "/api/user";

const getUser = async () => {
  let { data } = await axios.get(`${baseUserUrl}?address=${addr}`);
  return data;
};

const createUser = async () => {};

const updateUser = async (userPayload) => {
  let updatedUser = await axios.put(baseUserUrl, { userPayload });
  return updatedUser;
};

export { getUser, updateUser };
