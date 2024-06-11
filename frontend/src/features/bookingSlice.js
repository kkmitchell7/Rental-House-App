import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import bookingService from "../services/bookingService";

const initialState = {
  addBooking:null,
  editBooking:null,
  deleteBooking: null,
  booking: null,
  bookings: [],
  bookedDays: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (booking, thunkAPI) => {
    try {
      return await bookingService.createBooking(booking);
    } catch (error) {
      const message = error.message || error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, thunkAPI) => {
    try {
      return await bookingService.fetchBookings();
    } catch (error) {
      const message = error.message || error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAllBookedDays = createAsyncThunk(
  "booking/fetchAllBookedDays",
  async (_, thunkAPI) => {
    try {
      return await bookingService.fetchAllBookedDays();
    } catch (error) {
      const message = error.message || error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (bookingId, thunkAPI) => {
    try {
      return await bookingService.fetchBookingById(bookingId);
    } catch (error) {
      const message = error.message || error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async (booking, thunkAPI) => {
    try {
      return await bookingService.updateBooking(booking);
    } catch (error) {
      const message = error.message || error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteBookingById = createAsyncThunk(
  "booking/deleteBookingById",
  async (bookingId, thunkAPI) => {
    try {
      return await bookingService.deleteBookingsById(bookingId);
    } catch (error) {
      const message = error.message || error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetSuccessAndError: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setEditBooking: (state, { payload }) => {
      state.editBooking = payload;
      state.addBooking = null;
      state.deleteBooking = null;
    },
    setAddBooking: (state, { payload }) => {
      state.addBooking = payload;
      state.editBooking = null;
      state.deleteBooking = null;
    },
    setDeleteBooking: (state, { payload }) => {
      state.deleteBooking = payload;
      state.addBooking = null;
      state.editBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, { payload }) => {
        state.booking.push(payload.data);
        state.addBooking = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = payload.message;
      })
      .addCase(createBooking.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload.message;
      })
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
      })
      //here
      .addCase(fetchBookings.fulfilled, (state, { payload }) => {
        state.bookings = payload.Bookings;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = payload.message;
      })
      .addCase(fetchBookings.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload;
      })
      .addCase(fetchAllBookedDays.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBookedDays.fulfilled, (state, { payload }) => {
        state.bookedDays = payload.Bookings;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = payload.message;
      })
      .addCase(fetchAllBookedDays.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload;
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookingById.fulfilled, (state, { payload }) => {
        state.booking = payload.data;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = payload.message;
      })
      .addCase(fetchBookingById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload.message;
      })
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBooking.fulfilled, (state, { payload }) => {
        const index = state.booking.findIndex((x) => x.id === payload.data.id);
        state.booking = state.booking.filter((x) => x.id !== payload.data.id);
        state.booking.splice(index, 0, payload.data);
        state.editBooking = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = payload.message;
      })
      .addCase(updateBooking.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload.message;
      })
      .addCase(deleteBookingById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBookingById.fulfilled, (state, { payload }) => {
        state.booking = state.booking.filter((x) => x !== payload.id);
        state.deleteBooking = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;

        state.message = payload.message;
      })
      .addCase(deleteBookingById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload.message;
      });
  },
});

export const {
  reset,
  resetSuccessAndError,
  setAddBooking,
  setEditBooking,
  setDeleteBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;