import {
  GET_TOKEN,
  LOGIN_DATA,
  TOKEN_DATA,
  GET_DATA,
  GET_USER,
} from "./actions";

const initialState = {
  token: {},
  token_two: [],
  user: {},
  data: {},
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_DATA:
      return { ...state, token: action.payload };
    case TOKEN_DATA:
      return { ...state, token_two: action.payload };
    case GET_DATA:
      return { ...state, data: action.payload };
    case GET_USER:
      return { ...state, user: action.payload };
    default:
      return { ...state };
  }
};
export default rootReducer;
