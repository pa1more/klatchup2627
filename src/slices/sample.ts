import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISample {
  isLoading: boolean;
  token: string | null;
  location: any | null;
  locationexecuted: boolean;
  checkedInUsers: any[];
  nearbyUsers: any[];
  nearbyUsersExecuted: boolean;
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
  nearbyUsers: [],
  nearbyUsersExecuted: false,
  error: null,
  LocationId: "",
  ProfileIds: "",
};

export const sampleSlice = createSlice({
  name: "sample",
  initialState,
  reducers: {
    getSampleRequest: (state, action: PayloadAction<{ longitude: number; latitude: number; radiusMeters?: number; placeTypes?: string[] }>) => {
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

    // New actions for fetching nearby users by radius
    getNearbyUsersRequest: (state, action: PayloadAction<{ latitude: number; longitude: number; radiusMeters: number }>) => {
      state.isLoading = true;
      state.error = null;
      state.nearbyUsersExecuted = false;
      console.log('🔍 getNearbyUsersRequest:', action.payload);
    },
    getNearbyUsersSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      console.log('✅ getNearbyUsersSuccess - payload:', action.payload);
      console.log('✅ Profiles:', action.payload.profiles);
      state.nearbyUsers = action.payload.profiles || [];
      state.nearbyUsersExecuted = true;
      console.log('✅ State nearbyUsers updated:', state.nearbyUsers.length, 'users');
    },
    getNearbyUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.nearbyUsersExecuted = false;
      console.log('❌ getNearbyUsersFailure:', action.payload);
    },

    // Actions for fetching users at current check-in place
    getOnlineUsersAtPlaceRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.nearbyUsersExecuted = false;
      console.log('🔍 getOnlineUsersAtPlaceRequest:', action.payload);
    },
    getOnlineUsersAtPlaceSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      console.log('✅ getOnlineUsersAtPlaceSuccess - full payload:', action.payload);
      console.log('✅ onlineUsers array:', action.payload?.onlineUsers);
      console.log('✅ onlineUsers length:', action.payload?.onlineUsers?.length);
      const users = action.payload?.onlineUsers || [];
      console.log('✅ Filtered users:', users.map((u: any) => ({ id: u?.profileId, name: u?.name })));
      state.nearbyUsers = users;
      state.nearbyUsersExecuted = true;
      console.log('✅ State nearbyUsers updated:', state.nearbyUsers.length, 'users');
    },
    getOnlineUsersAtPlaceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.nearbyUsersExecuted = false;
      console.log('❌ getOnlineUsersAtPlaceFailure:', action.payload);
    },
  },
});

export const { actions: sampleAction, reducer: sampleReducer } = sampleSlice;
export const sampleSelector = (state: any) => state.sample;

