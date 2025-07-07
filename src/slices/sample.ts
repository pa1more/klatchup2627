import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISample {
  isLoading: boolean;
  token: string | null;
  location: any | null;
  locationexecuted: boolean;
  checkedInUsers: any[];
  error: string | null;
  LocationId: string;
  ProfileIds: string;
}

const initialState: ISample = {
  isLoading: false,
  token: null,
  location: null,
  locationexecuted: false,
  checkedInUsers: [], // Initialize empty array
  error: null,
  LocationId: "",
  ProfileIds: "",
};

export const sampleSlice = createSlice({
  name: "sample",
  initialState,
  reducers: {
    getSampleRequest: (state, action: PayloadAction<{ longitude: number; latitude: number }>) => {
      state.isLoading = true;
      state.error = null;
      state.locationexecuted = false;
    },
    getSampleSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.location = action.payload;
      state.locationexecuted = true;
    },
    getSampleFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.locationexecuted = false;
    },
    resetSampleRequest: (state) => {
      state.isLoading = false;
      state.location = null;
      state.error = null;
      state.locationexecuted = false;
    },

    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    // New actions for fetching checked-in users
    getCheckedInUsersRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    getCheckedInUsersSuccess: (state, action: PayloadAction<any[]>) => {
      state.isLoading = false;
      state.checkedInUsers = action.payload;
    },
    getCheckedInUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    //usercheckin with profileid and locationid
    userCheckingRequest: (state, action: PayloadAction<{ LocationId: string; ProfileIds: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    userCheckingSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.location = action.payload;
    },
    userCheckingFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { actions: sampleAction, reducer: sampleReducer } = sampleSlice;
export const sampleSelector = (state: any) => state.sample;

