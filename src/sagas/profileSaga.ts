
import { call, put, takeLatest, select } from "redux-saga/effects";
import { fetchAcceptRequestAPI, fetchAuthToken, fetchFriendRequestAPI, fetchUserByIdAPI, fetchUserByLocationNameAPI, fetchUserByMobileAPI, insertProfile, updateUserProfile } from "../services/api";
import { RootState } from "../store"; // Import RootState
import { sampleAction } from "../slices/sample";
import { PayloadAction } from "@reduxjs/toolkit";
import { getFriendAcceptFailure, getFriendAcceptRequest, getFriendAcceptSuccess, getFriendProfileFailure, getFriendProfileRequest, getFriendProfileSuccess, getMobileFailure, getMobileRequest, getMobileSuccess, getProfileIdFailure, getProfileIdRequest, getProfileIdSuccess, getProfileLocationFailure, getProfileLocationRequest, getProfileLocationSuccess, insertProfileFailure, insertProfileRequest, insertProfileSuccess, setAuthToken, updateFreindProfileRequest, updateFriendProfileFailure, updateFriendProfileSuccess, updateProfileFailure, updateProfileRequest, updateProfileSuccess } from "../slices/profile";
import { IProfile } from "../slices/profile";



function* insertProfileSaga(action: PayloadAction<{ profile: IProfile["profile"] }>): Generator {

    try {

        console.log("in saga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token; // 🔹 Using profile token

        // If token is null, fetch a new one
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }

        const profile = action.payload; // Extract profileData
        console.log("Inserting profile:", profile);
        const response = yield call(insertProfile, token, profile);
        yield put(insertProfileSuccess(response));

    } catch (error: any) {
        yield put(insertProfileFailure(error.message));
    }
};

function* getProfileByMobileSaga(action: PayloadAction<any>): Generator {

    try {
        console.log("in getProfileByMobileSaga api")
        const fullState: RootState = yield select((state) => state);
        let token = fullState.profile.token;
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(setAuthToken(token));
        }

        console.log("get profile:", action.payload);
        const mobileNo = action.payload;
        const response = yield call(fetchUserByMobileAPI, mobileNo, token);
        yield put(getMobileSuccess(response));

    } catch (error: any) {
        yield put(getMobileFailure(error.message));
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

export default function* profileSaga() {
    console.log("in Profile saga")
    yield takeLatest(insertProfileRequest.type, insertProfileSaga);
    yield takeLatest(getMobileRequest.type, getProfileByMobileSaga);
    yield takeLatest(getProfileIdRequest.type, getProfileByProfileIdSaga);
    yield takeLatest(updateProfileRequest.type, updateProfileSaga);
    yield takeLatest(getProfileLocationRequest.type, getProfileByLocationSaga);
    yield takeLatest(getFriendProfileRequest.type, getFriendRequestProfileSaga);
    yield takeLatest(getFriendAcceptRequest.type, getFriendAcceptProfileSaga);
    yield takeLatest(updateFreindProfileRequest.type, updateFriendProfileSaga);
}
