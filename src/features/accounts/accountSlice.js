// coding Redux with RTK

import { createSlice } from "@reduxjs/toolkit";
/* createSlice Benefit :
  1.create action creator from our reducer
  2.writing reducer a lot easear
  3.mutate state inside reducer
*/

/* for use thunk in RTK we have 2 way
  1.use action creator function
  2.use createAsyncThunk function (we will use in future project)
*/

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return { payload: { amount, purpose } };
      },

      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance -= action.payload.amount;
      },
    },
    payLoan(state) {
      if (state.loan === 0) return;

      state.balance += state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

/* use thunk in way 1
  hint: 1.function name must the same in acountSlice
        2.type too. nameOfSlice/nameOfReducer
      
    the Redux know that action creator is for reducer        
*/

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  // thunk
  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const moneyConvertedToDollor = await data.rates.USD;

    // dispatch action
    dispatch({ type: "account/deposit", payload: moneyConvertedToDollor });
  };
}

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export default accountSlice.reducer;
