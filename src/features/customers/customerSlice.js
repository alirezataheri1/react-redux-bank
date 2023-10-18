// coding Redux with RTK

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  nationalID: "",
  createdAt: "",
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    createCustomer: {
      prepare(fullName, nationalID) {
        /* hint
            in reducer we should not do side effent like created at instead even we have one payload we should create prepare function and do it in that function
        */
        return {
          payload: {
            fullName,
            nationalID,
            createdAt: new Date().toISOString(),
          },
        };
      },

      reducer(state, action) {
        state.fullName = action.payload.fullName;
        state.nationalID = action.payload.nationalID;
        state.createdAt = action.payload.createdAt;
      },
    },
    customerUpdateName(state, action) {
      state.fullName = action.payload;
    },
  },
});

export const { createCustomer, customerUpdateName } = customerSlice.actions;

export default customerSlice.reducer;
