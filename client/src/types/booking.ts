export interface Booking {
  _id: string;
  item: { name: string };
  schedule: { _id: string; date: string };
  seats: {
    _id: string;
    class: string;
    name: string;
    status: string;
    color: string;
  }[];
}
export interface StateType {
  booking: Booking;
}
