import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const TAX_RATE = 0.05;
const getId = (p) => (typeof p === "object" ? p._id : p);

const recalcTotals = (cart) => {
  cart.subTotal = cart.items.reduce((sum, i) => sum + (Number(i.total) || i.price * i.quantity || 0),0);
  cart.tax = cart.subTotal * TAX_RATE;
  cart.grandTotal = cart.subTotal + cart.tax - (cart.discount || 0);
};
const applyServerCart = (state, cartFromServer) => {
  state.cart = cartFromServer;
  state.count = cartFromServer.items.reduce((t, i) => t + i.quantity, 0);

  // ensure numbers
  state.cart.discount = Number(state.cart.discount) || 0;

  recalcTotals(state.cart);
};

export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const res = await api.get(`/cart/${userId}`);
  return res.data.cart;
});

export const addToCart = createAsyncThunk("cart/add", async (itemData) => {
  console.log(itemData)
  const res = await api.post("/cart/add", itemData);
  return res.data.cart;
});

export const updateQty = createAsyncThunk("cart/updateQty", async (itemData) => {
  const res = await api.put("/cart/updateqty", itemData);
  return res.data.cart;
});

export const removeItem = createAsyncThunk("cart/remove", async ({ user_id, product_id }) => {
  const res = await api.delete(`/cart/remove/${user_id}/${product_id}`);
  return res.data.cart;
});

export const clearCart = createAsyncThunk("cart/clear", async (userId) => {
  const res = await api.delete(`/cart/clear/${userId}`);
  return res.data.cart;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: { 
      items: [],
      subTotal: 0,
      tax: 0,
      discount: 0, 
      grandTotal: 0,
      deliveryAddress: null,
      mobile: null
    },
    count: 0,
  },
 reducers: {
  setDeliveryAddress: (state, action) => {
    state.cart.deliveryAddress = action.payload.address;
    state.cart.mobile = action.payload.mobile;
  },
},

  extraReducers: (builder) => {
    builder

      //  fetch cart
      .addCase(fetchCart.fulfilled, (state, action) => {
 applyServerCart(state, action.payload);      })

      //  instant ui change
      .addCase(addToCart.pending, (state, action) => {
        const { product_id, quantity, price, productName, vendor_id, images } = action.meta.arg;
        const existing = state.cart.items.find(i => getId(i.product_id) === product_id);
        if (existing) {
          existing.quantity += quantity;
          existing.total = existing.quantity * existing.price;
        } else {
          state.cart.items.push({
            product_id: { _id: product_id, images },
            vendor_id,
            productName,
            quantity,
            price : Number(price),
            total:Number(price) * quantity,
          });
        }

        state.count += quantity;
        recalcTotals(state.cart);
      })

      //  sync with server
      .addCase(addToCart.fulfilled, (state, action) => {
applyServerCart(state, action.payload);      })

      // OPTIMISTIC QTY UPDATE
     .addCase(updateQty.pending, (state, action) => {
  const { product_id, quantity } = action.meta.arg;
  const item = state.cart.items.find(i => getId(i.product_id) === product_id);
  if (!item) return;

  //  If quantity goes to 0 remove product from th cat
  if (quantity <= 0) {
    state.count -= item.quantity;
    state.cart.items = state.cart.items.filter(i => getId(i.product_id) !== product_id);
  } else {
    state.count += Number(quantity) - Number(item.quantity);
    item.quantity = Number(quantity);
    item.total = Number(quantity) * Number(item.price);
  }

  recalcTotals(state.cart);
})

      .addCase(updateQty.fulfilled, (state, action) => {
applyServerCart(state, action.payload);      })

      //  OPTIMISTIC REMOVE
      .addCase(removeItem.pending, (state, action) => {
        const { product_id } = action.meta.arg;
        const item = state.cart.items.find(i => getId(i.product_id) === product_id);
        if (!item) return;

        state.count -= item.quantity;
        state.cart.items = state.cart.items.filter(i => getId(i.product_id) !== product_id);
        recalcTotals(state.cart);
      })

      .addCase(removeItem.fulfilled, (state, action) => {
applyServerCart(state, action.payload);      })

      //  OPTIMISTIC CLEAR
      .addCase(clearCart.pending, (state) => {
        state.cart.items = [];
        state.count = 0;
        recalcTotals(state.cart);
      })

      .addCase(clearCart.fulfilled, (state, action) => {
applyServerCart(state, action.payload);      });
  },
});
export const { setDeliveryAddress } = cartSlice.actions;
export default cartSlice.reducer;
