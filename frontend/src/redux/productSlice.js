import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from '../api'

export const fetchProducts = createAsyncThunk(
    "products/fetch",async(_,{ getState })=>{
        const { search, category } = getState().products;
          const response = await api.get("/customer/getallproducts", {
  params: { search, category },
});
    return response.data;
    }
);
const productSlice = createSlice({
  name: "products",
  initialState: {
    search: "",
    category: null,
    products: [],
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export const { setSearch, setCategory } = productSlice.actions;
export default productSlice.reducer;
