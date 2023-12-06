import {PayloadAction, configureStore, createSlice} from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incremented: (state, action: PayloadAction<number | undefined>) => {
      state.value += action.payload ?? 1;
    },
    decremented: (state, action: PayloadAction<number | undefined>) => {
      state.value -= action.payload ?? 1;
    },
  },
});

export const {incremented, decremented} = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
