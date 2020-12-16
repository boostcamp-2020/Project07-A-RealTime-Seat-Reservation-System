import { bookingModel, scheduleModel, itemModel } from "../models";
import socket from "../socket";
import { Color } from "../constants";

const getBookingItem = async (_: void, { userId }: any) => {
  const bookingItem = await bookingModel.find({ userId, isAvailable: true });

  return bookingItem;
};

const bookItem = async (_: void, { userId, itemId, schedule, seats }: any) => {
  const item = await itemModel
    .findOne({ _id: itemId }, "name,place")
    .populate("place", "name location");

  await bookingModel.create({ userId, isAvailable: true, item, schedule, seats });
  await Promise.all(
    seats.map((seat: any) => {
      return scheduleModel.findOneAndUpdate(
        { _id: schedule._id, "seats._id": seat._id },
        {
          $set: {
            "seats.$.status": "sold",
            "seats.$.color": Color.SOLD_SEAT,
          },
        },
      );
    }),
  );

  let newCount: { [key: string]: any } = {
    VIP석: 0,
    R석: 0,
    S석: 0,
  };
  seats.forEach((seat: any) => {
    newCount = { ...newCount, [seat.class]: newCount[seat.class] + 1 };
  });

  const seatInfoData = (await scheduleModel.findOne({ _id: schedule._id }, "seatInfo")) as any;
  const { seatInfo } = seatInfoData;
  await Promise.all(
    seatInfo.map((seat: any) => {
      return scheduleModel.updateOne(
        { _id: schedule._id, "seatInfo._id": seat._id },
        {
          $set: {
            "seatInfo.$.count": seat.count - newCount[seat.class],
          },
        },
      );
    }),
  );

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
  const seatInfoData = (await scheduleModel.findOne({ _id: scheduleId }, "seatInfo")) as any;
  const { seatInfo } = seatInfoData;

  await Promise.all(
    bookingItem.seats.map((seat: any) => {
      return scheduleModel.findOneAndUpdate(
        { _id: scheduleId, "seats._id": seat._id },
        {
          $set: {
            "seats.$.status": "unsold",
            "seats.$.color": (Color as any)[seat.class],
          },
        },
      );
    }),
  );

  let newCount: { [key: string]: any } = {
    VIP석: 0,
    R석: 0,
    S석: 0,
  };
  bookingItem.seats.forEach((seat: any) => {
    newCount = { ...newCount, [seat.class]: newCount[seat.class] + 1 };
  });

  await Promise.all(
    seatInfo.map((seat: any) => {
      return scheduleModel.updateOne(
        { _id: scheduleId, "seatInfo._id": seat._id },
        {
          $set: {
            "seatInfo.$.count": seat.count + newCount[seat.class],
          },
        },
      );
    }),
  );

  socket.emit("cancelBooking", userId, scheduleId, seatIdArray);

  return { result: 1 };
};

export default { getBookingItem, bookItem, cancelItem };
