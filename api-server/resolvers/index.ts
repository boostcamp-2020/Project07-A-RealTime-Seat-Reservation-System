import { IResolvers } from "graphql-tools";
// import { testModel } from "../models";

const resolverMap: IResolvers = {
  Query: {
    // test: async (_: void, args) => {
    //   await testModel.create({ name: args.name });
    //   const data = await testModel.findOne({ name: args.name });

    //   return data;
    // },
  },
};

export default resolverMap;
