import { IResolvers } from "graphql-tools";
import { placeModel } from "../models";

const resolverMap: IResolvers = {
  Query: {
    seatGroup: async (_: void, args, __: void) => {
      const [data] = await placeModel.find({ name: args.id }, "seatGroup").exec();
      return (data as any).seatGroup;
    },
  },
};

export default resolverMap;
