import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from './features/auth/authSlice.js'
import { apiSlice } from "./api/apiSlice.js";
import favoritesReducer from '../redux/features/favorites/favoriteSlice.js'
import cartSliceReducer from ".//features/cart/cartSlice.js"
import shopReducer from './/features/shop/shopSlice.js'
import { getFavoritesFromLocalStorage } from "../utils/localStorage.js";


const initailFavorites = getFavoritesFromLocalStorage() || []

const store = configureStore({
  reducer : {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth : authReducer,
    favorites : favoritesReducer,
    cart : cartSliceReducer,
    shop : shopReducer,
  },
  preloadedState:{
    favorites : initailFavorites
  },

  middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
  devTools : true,
})
setupListeners(store.dispatch)
export default store