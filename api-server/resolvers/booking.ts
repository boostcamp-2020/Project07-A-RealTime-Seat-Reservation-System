import { bookingModel, scheduleModel } from "../models";
import socket from "../socket";
import { Color } from "../constants";

const getBookingItem = async (_: void, { userId }: any) => {
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

const bookItem = async (_: void, { userId, item, schedule, seats }: any) => {
  await bookingModel.create({ userId, isAvailable: true, item, schedule, seats });
  const scheduleData = (await scheduleModel.findOne({ _id: schedule._id }, "seats")) as any;

  seats.forEach((seat: any) => {
    const seatData = scheduleData.seats.id(seat._id);
    seatData.overwrite({ status: "sold", color: Color.SOLD_SEAT });
    seatData.save();
  });

  const seatIdArray = seats.map((seat: any) => seat._id);
  socket.emit("bookSeat", userId, schedule._id, seatIdArray);

  return { result: 1 };
};

const cancelItem = async (_: void, { userId, bookingId }: any) => {
  const bookingItem = (await bookingModel.findOne({
    _id: bookingId,
    userId,
    isAvailable: true,
  })) as any;
  await bookingModel.updateOne({ _id: bookingId }, { isAvailable: false });

  const scheduleId = bookingItem.schedule._id;
  const seatIdArray = bookingItem.seats.map((seat: any) => seat._id);
  socket.emit("cancelBooking", userId, scheduleId, seatIdArray);

  return { result: 1 };
};

export default { getBookingItem, bookItem, cancelItem };
