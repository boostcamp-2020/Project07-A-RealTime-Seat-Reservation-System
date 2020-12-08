import { userModel } from "../models";

const loginUser = async (_: void, { userName }: any) => {
  const result = await userModel.findOne({ userName });
  if (result === null) {
    const createResult = await userModel.create({ userName });
    return createResult;
  }

  return result;
};

export default { loginUser };
