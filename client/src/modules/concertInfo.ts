const CHANGE_SELECTED_CONCERT = "concertInfo/CHANGE_SELECTED_CONCERT" as const;

export const changeSelectedConcert = (id: string) => ({
  type: CHANGE_SELECTED_CONCERT,
  payload: id,
});

export interface concertInfo {
  title: string;
}

type ConcertInfoAction = ReturnType<typeof changeSelectedConcert>;

type ConcertInfoState = concertInfo;

const initialState: ConcertInfoState = {
  title: "뮤지컬 <그날들>",
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
