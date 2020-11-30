import { bookingModel } from "../models";

const getBookingItem = async (_: void, { userId }: any) => {
  const bookingItem = await bookingModel.find({ userId });

  return bookingItem;
};

const bookItem = async (_: void, { userId, seats }: any) => {
  await bookingModel.create({ userId, isAvailable: true, seats });
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

const cancelItem = async (_: void, { userId, bookingId }: any) => {
  await bookingModel.updateOne({ bookingId }, { isAvailable: false });
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

export default { getBookingItem, bookItem, cancelItem };
