import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingState {
  selectedServiceId: string | null;
  selectedProviderId: string | null;
  selectedDateTime: string | null;
  paymentMethod: 'pay_now' | 'pay_on_site' | null;
  isLoading: boolean;
}

const initialState: BookingState = {
  selectedServiceId: null,
  selectedProviderId: null,
  selectedDateTime: null,
  paymentMethod: null,
  isLoading: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<string>) => {
      state.selectedServiceId = action.payload;
    },
    setSelectedProvider: (state, action: PayloadAction<string>) => {
      state.selectedProviderId = action.payload;
    },
    setSelectedDateTime: (state, action: PayloadAction<string>) => {
      state.selectedDateTime = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<'pay_now' | 'pay_on_site'>) => {
      state.paymentMethod = action.payload;
    },
    clearBooking: (state) => {
      state.selectedServiceId = null;
      state.selectedProviderId = null;
      state.selectedDateTime = null;
      state.paymentMethod = null;
    },
  },
});

export const {
  setSelectedService,
  setSelectedProvider,
  setSelectedDateTime,
  setPaymentMethod,
  clearBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
