import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar ISODate
  scalar Date

  type Query {
    items(genre: String): [Item]
    itemDetail(itemId: ID): Item
    scheduleListByMonth(itemId: ID, startDate: String, endDate: String): [Schedule]
    bookingListByUserId(userId: ID): [Booking]
    genres: [Genre]
  }

  type Mutation {
    createUser(userName: String): UserResult
    bookItem(userId: ID, item: ItemInput, schedule: ScheduleInput, seats: [SeatInput]): [Booking]
    cancelItem(userId: ID, bookingId: ID): [Booking]
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
    classes: [Class]
    genre: String
  }

  type Price {
    class: String
    price: Int
  }

  type Place {
    name: String
    location: String
  }

  type Genre {
    name: String
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
    item: Item
    schedule: Schedule
    seats: [BookingSeat]
  }

  type Seat {
    _id: ID
    name: String
    status: String
    color: String
    class: String
  }

  type BookingSeat {
    _id: ID
    name: String
    class: String
    status: String
    color: String
    price: Int
  }

  input ItemInput {
    _id: ID
    name: String
    place: PlaceInput
  }

  input PlaceInput {
    name: String
    location: String
  }

  input ScheduleInput {
    _id: ID
    date: ISODate
  }

  input SeatInput {
    _id: ID
    name: String
    class: String
    status: String
    color: String
    price: Int
  }
`;

export default typeDefs;
