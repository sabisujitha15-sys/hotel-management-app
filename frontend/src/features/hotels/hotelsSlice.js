import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/hotelApi';

export const getHotels = createAsyncThunk('hotels/getHotels', async (params) => {
  const res = await api.fetchHotels(params);
  return res.data;
});

export const getHotelById = createAsyncThunk('hotels/getHotelById', async (id) => {
  const res = await api.fetchHotelById(id);
  return res.data;
});

export const addHotel = createAsyncThunk('hotels/addHotel', async (formData) => {
  const res = await api.createHotel(formData);
  return res.data;
});

export const editHotel = createAsyncThunk('hotels/editHotel', async ({ id, formData }) => {
  const res = await api.updateHotel(id, formData);
  return res.data;
});

export const removeHotel = createAsyncThunk('hotels/removeHotel', async (id) => {
  await api.deleteHotel(id);
  return id;
});

const initialState = {
  list: [],
  total: 0,
  offset: 0,
  limit: 6,
  currentHotel: null,
  status: 'idle',
  error: null,
  deleteSuccess: false,
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    clearCurrentHotel(state) {
      state.currentHotel = null;
    },
    clearDeleteSuccess(state) {
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHotels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getHotels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.hotels;
        state.total = action.payload.total;
        state.offset = action.payload.offset;
        state.limit = action.payload.limit;
      })
      .addCase(getHotels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.currentHotel = action.payload;
      })
      .addCase(removeHotel.fulfilled, (state, action) => {
        state.list = state.list.filter((h) => h.id !== action.payload);
        state.deleteSuccess = true;
      });
  },
});

export const { clearCurrentHotel, clearDeleteSuccess } = hotelsSlice.actions;
export default hotelsSlice.reducer;
