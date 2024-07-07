import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Ensure this path is correct

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/* Add custom middleware here */),
  devTools: process.env.NODE_ENV!== 'production', // Enable Redux DevTools in development
});

export default store;