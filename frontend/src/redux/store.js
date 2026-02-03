import { configureStore } from "@reduxjs/toolkit";
import products from './productSlice';

export const store = configureStore({
  reducer: { products },
});