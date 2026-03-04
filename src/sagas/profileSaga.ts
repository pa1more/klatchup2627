
import { call, put, takeLatest, select } from "redux-saga/effects";
import { fetchAcceptRequestAPI, fetchAuthToken, fetchFriendRequestAPI, fetchUserByIdAPI, fetchUserByLocationNameAPI, fetchUserByMobileAPI, insertProfile, updateUserProfile } from "../services/api";
import { RootState } from "../store"; // Import RootState
import { sampleAction } from "../slices/sample";
import { PayloadAction } from "@reduxjs/toolkit";
import { getFriendAcceptFailure, getFriendAcceptRequest, getFriendAcceptSuccess, getFriendProfileFailure, getFriendProfileRequest, getFriendProfileSuccess, getMobileFailure, getMobileRequest, getMobileSuccess, getProfileIdFailure, getProfileIdRequest, getProfileIdSuccess, getProfileLocationFailure, getProfileLocationRequest, getProfileLocationSuccess, insertProfileFailure, insertProfileRequest, insertProfileSuccess, setAuthToken, updateFreindProfileRequest, updateFriendProfileFailure, updateFriendProfileSuccess, updateProfileFailure, updateProfileRequest, updateProfileSuccess, restoreTokenSuccess, restoreTokenFailure, restoreSessionRequest, clearAuthSession } from "../slices/profile";
import { IProfile } from "../slices/profile";
import AsyncStorage from '@react-native-async-storage/async-storage';



function* insertProfileSaga(action: PayloadAction<{ profile: IProfile["profile"] }>): Generator {

    try {

        console.log("\n========== PROFILE SAGA START ==========")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;
        console.log("Token from state:", token ? "✅ Found" : "❌ Not found");

        // If token is null, fetch a new one
        if (!token) {
            console.log("No token in state, fetching new auth token...");
            try {
                token = (yield call(fetchAuthToken)) as string;
                console.log("✅ Auth token obtained successfully");
                yield put(setAuthToken(token));
            } catch (tokenError) {
                console.error("❌ Failed to obtain auth token:", tokenError);
                yield put(insertProfileFailure("Authentication failed. Please login again."));
                return;
            }
        }

        const profileData = action.payload.profile;
        console.log("Profile to insert - Name:", profileData.name, "Mobile:", profileData.mobile);
        
        try {
            console.log("Calling insertProfile API...");
            const response = yield call(insertProfile, token, profileData);
            console.log("✅ Profile insertion successful");
            yield put(insertProfileSuccess(response));
        } catch (apiError: any) {
            console.error("❌ API error:", apiError.message);
            
            // Check if error is 401 (token expired) and retry with fresh token
            if (apiError.message && (apiError.message.includes('401') || apiError.message.includes('Unauthorized'))) {
                console.log("Token expired, attempting refresh...");
                try {
                    const freshToken = (yield call(fetchAuthToken)) as string;
                    console.log("✅ Fresh token obtained, retrying...");
                    yield put(setAuthToken(freshToken));
                    const retryResponse = yield call(insertProfile, freshToken, profileData);
                    console.log("✅ Retry successful");
                    yield put(insertProfileSuccess(retryResponse));
                } catch (retryError: any) {
                    console.error("❌ Retry failed:", retryError.message);
                    yield put(insertProfileFailure(retryError.message || "Profile creation failed"));
                }
            } else {
                throw apiError;
            }
        }
        console.log("========== PROFILE SAGA END ==========");

    } catch (error: any) {
        console.error("\n❌ Fatal error in insertProfileSaga:", error.message);
        console.log("========== PROFILE SAGA END (ERROR) ==========");
        yield put(insertProfileFailure(error.message || "Failed to insert profile"));
    }
};

function* getProfileByMobileSaga(action: PayloadAction<any>): Generator {

    try {
        console.log("in getProfileByMobileSaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;
        console.log("Token before fetch:", token ? "exists" : "null");
        
        if (!token) {
            console.log("Fetching auth token...");
            try {
                token = (yield call(fetchAuthToken)) as string;
                console.log("Token fetched:", token ? "success" : "failed");
                yield put(setAuthToken(token));
            } catch (tokenError) {
                console.error("Failed to fetch token:", tokenError);
                yield put(getMobileFailure("Failed to obtain authentication token"));
                return;
            }
        }

        console.log("Calling API with mobile:", action.payload);
        const mobileNo = action.payload;
        
        try {
            const response = yield call(fetchUserByMobileAPI, mobileNo, token);
            console.log("API Response received:", response);
            yield put(getMobileSuccess(response));
        } catch (apiError: any) {
            // Handle token expiration
            if (apiError.message && (apiError.message.includes('401') || apiError.message.includes('Unauthorized'))) {
                console.log("Token expired, getting fresh token...");
                try {
                    const freshToken = (yield call(fetchAuthToken)) as string;
                    yield put(setAuthToken(freshToken));
                    const retryResponse = yield call(fetchUserByMobileAPI, mobileNo, freshToken);
                    yield put(getMobileSuccess(retryResponse));
                } catch (retryError: any) {
                    yield put(getMobileFailure(retryError.message));
                }
            } else {
                throw apiError;
            }
        }

    } catch (error: any) {
        console.error("Error in getProfileByMobileSaga:", error);
        yield put(getMobileFailure(error.message || "Failed to fetch profile"));
    }
};

function* getProfileByProfileIdSaga(action: PayloadAction<any>): Generator {

    try {

        console.log("in getProfileByProfileIdSaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }
        console.log("get profile:", action.payload);
        const profileId = action.payload;
        const response = yield call(fetchUserByIdAPI, profileId, token);
        yield put(getProfileIdSuccess(response));

    } catch (error: any) {
        yield put(getProfileIdFailure(error.message));
    }
};

function* updateProfileSaga(action: PayloadAction<{ profile: IProfile["profile"], profileId: string }>): Generator {

    try {

        console.log("in updateprofilesaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;

        // Using profile token
        // If token is null, fetch a new one

        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }
        const profile = action.payload; // Extract profileData
        const ProfileId = action.payload.profileId;
        console.log("update profile:", profile);
        const response = yield call(updateUserProfile, token, profile, ProfileId);
        yield put(updateProfileSuccess(response));

    } catch (error: any) {
        yield put(updateProfileFailure(error.message));
    }
}

function* getProfileByLocationSaga(action: PayloadAction<any>): Generator {

    try {

        console.log("in getprofilesaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;

        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }
        const placeName = action.payload; // Extract profileData
        console.log("get profile:", placeName);
        const response = yield call(fetchUserByLocationNameAPI, placeName, token);
        yield put(getProfileLocationSuccess(response));

    } catch (error: any) {
        yield put(getProfileLocationFailure(error.message));
    }
}

function* getFriendRequestProfileSaga(action: PayloadAction<any>): Generator {

    try {
        console.log("in getFriendRequestProfileSaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }
        const profileId = action.payload; // Extract profileData
        console.log("get profile:", profileId);
        const response = yield call(fetchFriendRequestAPI, profileId, token);
        yield put(getFriendProfileSuccess(response));

    } catch (error: any) {
        yield put(getFriendProfileFailure(error.message));
    }
}

function* getFriendAcceptProfileSaga(action: PayloadAction<any>): Generator {

    try {
        console.log("in getFriendAcceptProfileSaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }
        const profileId = action.payload; // Extract profileData
        console.log("get profile:", profileId);
        const response = yield call(fetchAcceptRequestAPI, profileId, token);
        yield put(getFriendAcceptSuccess(response));

    } catch (error: any) {
        yield put(getFriendAcceptFailure(error.message));
    }
}

function* updateFriendProfileSaga(action: PayloadAction<{ profile: IProfile["profile"], profileId: string }>): Generator {

    try {

        console.log("in updateFriendProfileSaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;

        // Using profile token
        // If token is null, fetch a new one

        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }
        const profile = action.payload; // Extract profileData
        const ProfileId = action.payload.profileId;
        console.log("update profile:", profile);
        const response = yield call(updateUserProfile, token, profile, ProfileId);
        yield put(updateFriendProfileSuccess(response));

    } catch (error: any) {
        yield put(updateFriendProfileFailure(error.message));
    }
}

// ========== SESSION MANAGEMENT SAGAS ==========

function* persistTokenSaga(action: PayloadAction<string>): Generator {
    try {
        const token = action.payload;
        yield call([AsyncStorage, 'setItem'], '@auth_token', token);
        console.log('💾 Auth token persisted to AsyncStorage');
    } catch (error: any) {
        console.error('❌ Failed to persist auth token:', error);
    }
}

function* restoreSessionSaga(): Generator {
    try {
        console.log('🔄 Attempting to restore session from AsyncStorage...');
            const savedToken = (yield call([AsyncStorage, 'getItem'], '@auth_token')) as string | null;
            const savedMobile = (yield call([AsyncStorage, 'getItem'], 'MobileNo')) as string | null;
        
        if (savedToken) {
                console.log('✅ Session restored - Auth token found, mobile:', savedMobile || 'not found');
            yield put(restoreTokenSuccess(savedToken));
            
                // If mobile number exists, fetch the full profile
                if (savedMobile) {
                    console.log('📱 Fetching profile for restored session...');
                    yield put(getMobileRequest(savedMobile));
                } else {
                    console.log('⚠️ No mobile number found - profile not fetched');
                }
        } else {
            console.log('⚠️ No session found - Starting fresh');
            yield put(restoreTokenFailure());
        }
    } catch (error: any) {
        console.error('❌ Failed to restore session:', error);
        yield put(restoreTokenFailure());
    }
}

function* logoutSaga(): Generator {
    try {
        console.log('🚪 Logging out - clearing session');
        yield call([AsyncStorage, 'removeItem'], '@auth_token');
        yield call([AsyncStorage, 'removeItem'], 'MobileNo');
        yield put(clearAuthSession());
        console.log('✅ Session cleared');
    } catch (error: any) {
        console.error('❌ Failed to clear session:', error);
    }
}

export default function* profileSaga() {
    console.log("in Profile saga")
    // Profile operations
    yield takeLatest(insertProfileRequest.type, insertProfileSaga);
    yield takeLatest(getMobileRequest.type, getProfileByMobileSaga);
    yield takeLatest(getProfileIdRequest.type, getProfileByProfileIdSaga);
    yield takeLatest(updateProfileRequest.type, updateProfileSaga);
    yield takeLatest(getProfileLocationRequest.type, getProfileByLocationSaga);
    yield takeLatest(getFriendProfileRequest.type, getFriendRequestProfileSaga);
    yield takeLatest(getFriendAcceptRequest.type, getFriendAcceptProfileSaga);
    yield takeLatest(updateFreindProfileRequest.type, updateFriendProfileSaga);
    
    // Session management
    yield takeLatest(setAuthToken.type, persistTokenSaga);
    yield takeLatest(restoreSessionRequest.type, restoreSessionSaga);
}
