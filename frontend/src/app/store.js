import { configureStore } from '@reduxjs/toolkit';
import hotelsReducer from '../features/hotels/hotelsSlice';

export default configureStore({
  reducer: {
    hotels: hotelsReducer,
  },
});
