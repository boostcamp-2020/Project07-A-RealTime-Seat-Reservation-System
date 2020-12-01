import { IResolvers } from "graphql-tools";
import { GraphQLDateTime } from "graphql-iso-date";
import itemResolvers from "./item";
import scheduleResolvers from "./schedule";
import userResolvers from "./user";
import bookingResolvers from "./booking";

const resolverMap: IResolvers = {
  Query: {
    items: itemResolvers.getItemList,
    itemDetail: itemResolvers.getItemDetail,
    scheduleListByMonth: scheduleResolvers.getScheduleListByMonth,
    bookingListByUserId: bookingResolvers.getBookingItem,
  },

  Mutation: {
    createUser: userResolvers.createUser,
    bookItem: bookingResolvers.bookItem,
    cancelItem: bookingResolvers.cancelItem,
  },

  ISODate: GraphQLDateTime,
};

export default resolverMap;
