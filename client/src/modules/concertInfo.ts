const CHANGE_SELECTED_CONCERT = "concertInfo/CHANGE_SELECTED_CONCERT" as const;

export const changeSelectedConcert = (id: string) => ({
  type: CHANGE_SELECTED_CONCERT,
  payload: id,
});

export interface ConcertInfo {
  title: string;
  price: string;
  period: string;
  runningTime: string;
  class: string;
}

type ConcertInfoAction = ReturnType<typeof changeSelectedConcert>;

type ConcertInfoState = ConcertInfo;

const initialState: ConcertInfoState = {
  title: "뮤지컬 <그날들>",
  price: "무료 ~ 140,000원",
  period: "2020. 11. 13(금) ~ 2021. 2. 7(일)",
  runningTime: "2시간 45분",
  class: "8세이상 관람가",
};

const concertInfoReducer = (
  state: ConcertInfoState = initialState,
  action: ConcertInfoAction
): ConcertInfoState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default concertInfoReducer;
