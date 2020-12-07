const SET_ITEMS = "items/SET_ITEMS" as const;

export const setItems = (items: []) => ({
  type: SET_ITEMS,
  payload: items,
});

type ItemsState = Array<any>;
type ItemsAction = ReturnType<typeof setItems>;

const initialState: [] = [];

const itemsReducer = (state: ItemsState = initialState, action: ItemsAction): ItemsState => {
  switch (action.type) {
    case SET_ITEMS:
      return [...action.payload];
    default:
      return state;
  }
};

export default itemsReducer;
