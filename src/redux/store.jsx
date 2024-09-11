import { configureStore } from "@reduxjs/toolkit";
import userInformationSlice from "./slice/userInformationSlice";

export const Store = configureStore({
  reducer: {
    userInformation: userInformationSlice,
  },
});

export default Store;
