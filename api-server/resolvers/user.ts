import { userModel } from "../models";

const createUser = async (_: void, { userName }: any) => {
  const result = await userModel.findOne({ userName });
  if (result === null) {
    const createResult = await userModel.create({ userName });
    return { result: true, user: createResult };
  }

  return { result: false, user: null };
};

export default { createUser };
