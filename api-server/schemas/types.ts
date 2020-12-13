import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar ISODate
  scalar Date

  type Query {
    items(genre: String): [Item]
    itemDetail(itemId: ID): Item
    scheduleListByMonth(itemId: ID): [Schedule]
    bookingListByUserId(userId: ID): [Booking]
    genres: [Genre]
    seats(scheduleId: ID): [Seat]
  }

  type Mutation {
    loginUser(userName: String): User
    bookItem(userId: ID, itemId: ID, scheduleId: ID, seats: [ID]): [Booking]
    cancelItem(userId: ID, bookingId: ID): [Booking]
  }

  type Subscription {
    unSoldSeats: [Seat]
    soldSeats: [Seat]
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
    runningTime: String
    ageLimit: String
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
    seatInfo: [Class]
  }

  type Class {
    class: String
    color: String
    count: Int
  }

  type User {
    _id: ID
    userName: String
  }

  type Booking {
    _id: ID
    item: Item
    schedule: BookedSchedule
    seats: [BookingSeat]
  }

  type Seat {
    _id: ID
    name: String
    status: String
    color: String
    class: String
    point: Point
  }

  type Point {
    x: Int
    y: Int
  }

  type BookingSeat {
    _id: ID
    name: String
    class: String
    status: String
    color: String
    price: Int
  }

  type BookedSchedule {
    _id: ID
    date: String
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
    date: String
  }

  input SeatInput {
    _id: ID
    name: String
    class: String
  }
`;

export default typeDefs;
