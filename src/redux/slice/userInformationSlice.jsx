import { createSlice } from "@reduxjs/toolkit";

export const userInformationSlice = createSlice({
  name: "userInformation",
  initialState: {
    userInformation: { id: 1 },
    loading: false,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      console.log("action", action.payload);
      state.userInformation = action.payload;
    },
    logout: state => {
      state.userInformation = {};
    },
  },
});

// Export actions and reducer
export const { login, logout } = userInformationSlice.actions;
export default userInformationSlice.reducer;
