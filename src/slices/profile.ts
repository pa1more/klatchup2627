import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface IProfile {
    isLoading: boolean;
    mobile_isLoading: boolean;
    profileid_isLoading: boolean;
    profileLocation_isLoading: boolean;
    friendRequest_isLoading: boolean;
    friendAccept_isLoading: boolean;
    mobile_error: string | null;
    profileid_error: string | null;
    profileLocation_error: string | null;
    friendRequest_error: string | null;
    friendAccept_error: string | null;
    token: string | null;
    error: string | null;
    friendupdateerror: string | null;
    insertProfileExecuted: boolean;
    updateProfileExecuted: boolean;
    updateFriendProfileExecuted: boolean;
    mobileexecuted: boolean;
    profileidexecuted: boolean;
    profileLocationexecuted: boolean;
    friendRequestexecuted: boolean;
    friendAcceptexecuted: boolean;
    profile: {
        name: string;
        mobile: string;
        birthDate: string;
        gender: string;
        interests: {
            name: string;
            subInterest: string;
        }[];
        city: string;
        bio: string;
        profilePicture: string;
        showPictures: {
            priority: number;
            path: string;
        }[];
        work: string;
        education: string;
        lookingFor: string;
        currentLocation: {
            placeName: string;
            lat: string;
            long: string;
        };
        isActive: boolean;
        isDeleted: boolean;
        updatedAt: boolean;
    };
    mobileCheck: any[];
    friendUpdate: any[];
    profileidCheck: any[];
    profileLocation: any[];
    friendRequest: any[];
    friendAccept: any[];
}

const initialState: IProfile = {
    isLoading: false,
    mobile_isLoading: false,
    profileid_isLoading: false,
    profileLocation_isLoading: false,
    friendRequest_isLoading: false,
    friendAccept_isLoading: false,
    mobile_error: "",
    friendupdateerror: "",
    profileid_error: "",
    profileLocation_error: "",
    friendRequest_error: "",
    friendAccept_error: "",
    token: null,
    error: null,
    updateFriendProfileExecuted: false,
    insertProfileExecuted: false,
    updateProfileExecuted: false,
    mobileexecuted: false,
    profileidexecuted: false,
    profileLocationexecuted: false,
    friendRequestexecuted: false,
    friendAcceptexecuted: false,
    profile: {
        name: "",
        mobile: "",
        birthDate: "",
        gender: "",
        interests: [], // Initialize as an empty array
        city: "",
        bio: "",
        profilePicture: "",
        showPictures: [], // Initialize as an empty array
        work: "",
        education: "",
        lookingFor: "",
        currentLocation: {
            placeName: "",
            lat: "",
            long: "",
        },
        isActive: true,
        isDeleted: false,
        updatedAt: true,
    },
    mobileCheck: [],
    friendUpdate: [],
    profileidCheck: [],
    profileLocation: [],
    friendRequest: [],
    friendAccept: []
};

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {

        getProfileRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getProfileSuccess: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.profile = action.payload;
        },
        getProfileFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        setAuthToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            console.log('✅ Auth token set (will persist to AsyncStorage via saga)');
        },

        restoreTokenSuccess: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            console.log('✅ Auth token restored from AsyncStorage');
        },

        restoreTokenFailure: (state) => {
            state.token = null;
            console.log('⚠️ No saved token found - new session');
        },

        clearAuthSession: (state) => {
            state.token = null;
            state.mobileCheck = [];
            state.profile = {
                name: "",
                mobile: "",
                birthDate: "",
                gender: "",
                interests: [],
                city: "",
                bio: "",
                profilePicture: "",
                showPictures: [],
                work: "",
                education: "",
                lookingFor: "",
                currentLocation: { placeName: "", lat: "", long: "" },
                isActive: true,
                isDeleted: false,
                updatedAt: true,
            };
            console.log('🚪 Auth session cleared');
        },

        restoreSessionRequest: (state) => {
            // Trigger by saga to restore session
            console.log('🔄 Starting session restoration...');
        },

        // 🔹 New action for inserting profile
        insertProfileRequest: (state, action: PayloadAction<{ profile: IProfile["profile"] }>) => {
            state.isLoading = true;
            state.insertProfileExecuted = false;
        },
        insertProfileSuccess: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.mobileCheck = action.payload;
            state.insertProfileExecuted = true;
        },
        insertProfileFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.insertProfileExecuted = false;
        },
        resetInsertProfileExecuted: (state) => {
            state.insertProfileExecuted = false;
            state.error = null;
        },

        //New action for Mobile request

        getMobileRequest: (state, action: PayloadAction<string>) => {
            state.mobile_isLoading = true;
            state.mobile_error = null;
            state.mobileexecuted = false;
        },
        getMobileSuccess: (state, action: PayloadAction<any[]>) => {
            state.mobile_isLoading = false;
            state.mobileCheck = action.payload;
            state.mobile_error = null;
            state.mobileexecuted = true;
        },
        getMobileFailure: (state, action: PayloadAction<string>) => {
            state.mobile_isLoading = false;
            state.mobile_error = action.payload;
            state.mobileexecuted = false;
        },
        resetMobileExecuted: (state) => {
            state.mobileexecuted = false;
            state.mobile_error = null;
            //state.mobileCheck = [];
        },

        //New action for ProfileId request

        getProfileIdRequest: (state, action: PayloadAction<string>) => {
            state.profileid_isLoading = true;
            state.profileid_error = null;
            state.profileidexecuted = false;
        },
        getProfileIdSuccess: (state, action: PayloadAction<any[]>) => {
            state.profileid_isLoading = false;
            state.profileidCheck = action.payload;
            state.profileid_error = null;
            state.profileidexecuted = true;
        },
        getProfileIdFailure: (state, action: PayloadAction<string>) => {
            state.profileid_isLoading = false;
            state.profileid_error = action.payload;
            state.profileidexecuted = false;
        },
        resetProfileIdExecuted: (state) => {
            state.profileidexecuted = false;
            state.profileid_error = null;
            state.profileidCheck = [];
        },

        // 🔹 New action for inserting profile
        updateProfileRequest: (state, action: PayloadAction<{ profile: IProfile["profile"], profileId: string }>) => {
            state.isLoading = true;
            state.updateProfileExecuted = false;
        },
        updateProfileSuccess: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.mobileCheck = action.payload;
            state.updateProfileExecuted = true;
        },
        updateProfileFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.updateProfileExecuted = false;
        },
        resetupdateProfileExecuted: (state) => {
            state.updateProfileExecuted = false;
            state.error = null;
        },

        //-----------Logout function
        logout: () => initialState,

        // 🔹 New action for ProfileId request

        getProfileLocationRequest: (state, action: PayloadAction<string>) => {
            state.profileLocation_isLoading = true;
            state.profileLocation_error = null;
            state.profileLocationexecuted = false;
        },
        getProfileLocationSuccess: (state, action: PayloadAction<any[]>) => {
            state.profileLocation_isLoading = false;
            state.profileLocation = action.payload;
            state.profileLocation_error = null;
            state.profileLocationexecuted = true;
        },
        getProfileLocationFailure: (state, action: PayloadAction<string>) => {
            state.profileLocation_isLoading = false;
            state.profileLocation_error = action.payload;
            state.profileLocationexecuted = false;
        },
        resetProfileLocationExecuted: (state) => {
            state.profileLocationexecuted = false;
            state.profileLocation_error = null;
            //state.profileLocation = [];
        },

        // 🔹 New action for Get profile of frient request
        getFriendProfileRequest: (state, action: PayloadAction<string>) => {
            state.friendRequest_isLoading = true;
            state.friendRequest_error = null;
            state.friendRequestexecuted = false;
        },
        getFriendProfileSuccess: (state, action: PayloadAction<any[]>) => {
            state.friendRequest_isLoading = false;
            state.friendRequest = action.payload;
            state.friendRequest_error = null;
            state.friendRequestexecuted = true;
        },
        getFriendProfileFailure: (state, action: PayloadAction<string>) => {
            state.friendRequest_isLoading = false;
            state.friendRequest_error = action.payload;
            state.friendRequestexecuted = false;
        },
        // resetFriendProfileExecuted: (state) => {
        //     state.profileLocationexecuted = false;
        //     state.profileLocation_error = null;
        //     //state.profileLocation = [];
        // },

        // 🔹 New action for Get profile of frient Accept
        getFriendAcceptRequest: (state, action: PayloadAction<string>) => {
            state.friendAccept_isLoading = true;
            state.friendAccept_error = null;
            state.friendAcceptexecuted = false;
        },
        getFriendAcceptSuccess: (state, action: PayloadAction<any[]>) => {
            state.friendAccept_isLoading = false;
            state.friendAccept = action.payload;
            state.friendAccept_error = null;
            state.friendAcceptexecuted = true;
        },
        getFriendAcceptFailure: (state, action: PayloadAction<string>) => {
            state.friendAccept_isLoading = false;
            state.friendAccept_error = action.payload;
            state.friendAcceptexecuted = false;
        },

        // 🔹 Update friend Profile
        updateFreindProfileRequest: (state, action: PayloadAction<{ profile: IProfile["profile"], profileId: string }>) => {
            state.isLoading = true;
            state.updateFriendProfileExecuted = false;
        },
        updateFriendProfileSuccess: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.friendUpdate = action.payload;
            state.updateFriendProfileExecuted = true;
        },
        updateFriendProfileFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.friendupdateerror = action.payload;
            state.updateFriendProfileExecuted = false;
        },
        resetFriendupdateProfileExecuted: (state) => {
            state.updateFriendProfileExecuted = false;
            state.friendupdateerror = null;
        },
    },
});

export const {
    getProfileRequest,
    getProfileSuccess,
    getProfileFailure,
    setAuthToken,
    restoreTokenSuccess,
    restoreTokenFailure,
    restoreSessionRequest,
    clearAuthSession,
    insertProfileRequest, // Export new actions
    insertProfileSuccess,
    insertProfileFailure,
    resetInsertProfileExecuted,
    getMobileRequest,
    getMobileSuccess,
    getMobileFailure,
    resetMobileExecuted,
    getProfileIdRequest,
    getProfileIdFailure,
    getProfileIdSuccess,
    resetProfileIdExecuted,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFailure,
    resetupdateProfileExecuted,
    logout,
    getProfileLocationRequest,
    getProfileLocationFailure,
    getProfileLocationSuccess,
    resetProfileLocationExecuted,
    getFriendProfileRequest,
    getFriendProfileSuccess,
    getFriendProfileFailure,
    getFriendAcceptRequest,
    getFriendAcceptFailure,
    getFriendAcceptSuccess,
    updateFreindProfileRequest,
    updateFriendProfileFailure,
    updateFriendProfileSuccess
} = profileSlice.actions;

export const profileReducer = profileSlice.reducer;
export const profileSelector = (state: RootState) => state.profile;
