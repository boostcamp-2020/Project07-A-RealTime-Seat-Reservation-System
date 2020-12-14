import { bookingModel, scheduleModel } from "../models";
import { pubsub, socket } from "../socket";
import { Color } from "../constants";

const getBookingItem = async (_: void, { userId }: any) => {
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

const bookItem = async (_: void, { userId, itemId, scheduleId, seats }: any) => {
  const sseaa = seats as any;
  const sd = (await scheduleModel.findOne({ _id: scheduleId }, "seats")) as any;
  const ssd = sd.seats.id(sseaa[0]) as any;

  ssd.overwrite({ status: "sold", color: Color.SOLD_SEAT });
  await ssd.save();
  const newasdf = { ...ssd, status: "sold", color: Color.SOLD_SEAT };
  // await bookingModel.create({ userId, isAvailable: true, item, schedule, seats });

  pubsub.publish("soldSeats", {
    soldSeats: newasdf,
  });

  socket.emit("bookSeat", userId, scheduleId, newasdf);
  // onst bookingItem = await bookingModel.find({ userId, isAvailable: true });

  // return bookingItem;
};

const cancelItem = async (_: void, { userId, bookingId }: any) => {
  await bookingModel.updateOne({ _id: bookingId }, { isAvailable: false });
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  socket.emit("cancelBooking");

  return bookingItem;
};

export default { getBookingItem, bookItem, cancelItem };
