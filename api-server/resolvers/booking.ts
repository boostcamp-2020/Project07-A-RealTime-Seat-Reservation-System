import { bookingModel } from "../models";

const getBookingItem = async (_: void, { userId }: any) => {
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

const bookItem = async (_: void, { userId, item, schedule, seats }: any) => {
  await bookingModel.create({ userId, isAvailable: true, item, schedule, seats });
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

const cancelItem = async (_: void, { userId, bookingId }: any) => {
  await bookingModel.updateOne({ _id: bookingId }, { isAvailable: false });
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

export default { getBookingItem, bookItem, cancelItem };
