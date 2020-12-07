import { IResolvers } from "graphql-tools";
import { GraphQLDateTime } from "graphql-iso-date";
import itemResolvers from "./item";
import scheduleResolvers from "./schedule";
import userResolvers from "./user";
import bookingResolvers from "./booking";
import genreResolvers from "./genre";

const resolverMap: IResolvers = {
  Query: {
    items: itemResolvers.getItemListByGenre,
    itemDetail: itemResolvers.getItemDetail,
    scheduleListByMonth: scheduleResolvers.getScheduleListByMonth,
    bookingListByUserId: bookingResolvers.getBookingItem,
    genres: genreResolvers.getGenres,
  },

  Mutation: {
    createUser: userResolvers.createUser,
    bookItem: bookingResolvers.bookItem,
    cancelItem: bookingResolvers.cancelItem,
  },

  ISODate: GraphQLDateTime,
};

export default resolverMap;
