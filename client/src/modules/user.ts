import { UserInterface } from "../types/user";

const SET_USER = "user/SET_USER" as const;

export const setUser = (user: UserInterface) => ({
  type: SET_USER,
  payload: { ...user },
});

type UserActionType = ReturnType<typeof setUser>;
type UserStateType = UserInterface | null;

const userReducer = (state: UserStateType = null, action: UserActionType): UserStateType => {
  switch (action.type) {
    case SET_USER:
      return { ...action.payload };

    default:
      return state;
  }
};

export default userReducer;
