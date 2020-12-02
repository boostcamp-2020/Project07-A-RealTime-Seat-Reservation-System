export interface SeatInfo {
  id: string;
  color: string;
  name: string;
  point: { x: number; y: number };
  status: string;
}

export interface EmptySeatCount {
  class: string;
  count: number;
}
