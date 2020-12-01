import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar ISODate
  scalar Date

  type Query {
    items: [Item]
    itemDetail(itemId: ID): Item
    scheduleListByMonth(itemId: ID, startDate: String, endDate: String): [Schedule]
    bookingListByUserId(userId: ID): [Booking]
  }

  type Mutation {
    createUser(userName: String): UserResult
    bookItem(userId: ID, seats: [SeatInput]): Boolean
    cancelItem(userID: ID, bookingId: ID): [Booking]
  }

  type Item {
    _id: ID
    name: String
    startDate: ISODate
    endDate: ISODate
    place: Place
    img: String
    minBookingCount: Int
    maxBookingCount: Int
    prices: [Price]
  }

  type Price {
    class: String
    price: Int
  }

  type Place {
    name: String
    location: String
  }

  type Schedule {
    _id: ID
    date: ISODate
    seatGroups: [Class]
  }

  type Class {
    class: String
    color: String
  }

  type UserResult {
    result: Boolean
    user: User
  }

  type User {
    _id: ID
    userName: String
  }

  type Booking {
    _id: ID
    itemName: String
    date: Date
    seats: [Seat]
  }

  type Seat {
    _id: ID
    name: String
    status: String
    color: String
    class: String
  }

  input SeatInput {
    _id: ID
    name: String
    status: String
    color: String
    class: String
  }
`;

export default typeDefs;
