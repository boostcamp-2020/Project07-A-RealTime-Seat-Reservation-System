export interface SeatInfo {
  _id: string;
  color: string;
  name: string;
  class: string;
  point: { x: number; y: number };
  status: string;
}

export interface EmptySeatCount {
  class: string;
  count: number;
}
