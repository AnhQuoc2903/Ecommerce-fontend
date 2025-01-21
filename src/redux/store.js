import { configureStore } from "@reduxjs/toolkit";

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case "counter/increment":
      return state + 1;
    case "counter/decrement":
      return state - 1;
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
