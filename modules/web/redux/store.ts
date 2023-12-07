import {PayloadAction, configureStore, createSlice} from '@reduxjs/toolkit';
import {apiSlice} from './dogs-api-slice';

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
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
