import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const CREATE = "socket/CREATE" as const;

export const create = () => ({ type: CREATE });

type socketAction = ReturnType<typeof create>;

interface socketState {
  socket?: Socket;
}

const initialState: socketState = {
  socket: undefined,
};

const socketReducer = (
  state: socketState = initialState,
  action: socketAction
) => {
  switch (action.type) {
    case CREATE:
      return {
        socket: io(`http://localhost:8080/A`, {
          transports: ["websocket"],
          upgrade: false,
        }),
      };
    default:
      return state;
  }
};

export default socketReducer;
