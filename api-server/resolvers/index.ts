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
    scheduleListByMonth: scheduleResolvers.getScheduleListByItemId,
    bookingListByUserId: bookingResolvers.getBookingItem,
    genres: genreResolvers.getGenres,
    seats: scheduleResolvers.getSeatsByScheduleId,
  },

  Mutation: {
    loginUser: userResolvers.loginUser,
    bookItem: bookingResolvers.bookItem,
    cancelItem: bookingResolvers.cancelItem,
  },

  ISODate: GraphQLDateTime,
};

export default resolverMap;
