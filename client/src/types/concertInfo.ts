export interface Prices {
  color: string;
  class: string;
  price: number;
}

export interface SelectedConcertInfo {
  itemId: string;
  title: string;
  date: string;
  time: string;
  price: Prices[];
}

export interface Props {
  concertId: string;
}
