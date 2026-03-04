import { call, put, takeLatest, select } from "redux-saga/effects";
import { sampleAction, sampleSelector } from "../slices/sample";
import { fetchAuthToken, fetchLocation, fetchCheckedInUsersAPI, userLocationcheckin, fetchNearbyUsersAPI } from "../services/api";
import { getOnlineUsersAPI } from "../services/checkinService";
import { RootState } from "../store"; // Import RootState


function* fetchLocationSaga(action: ReturnType<typeof sampleAction.getSampleRequest>): Generator {

    try {
        //console.log("Saga Triggered: fetchLocationSaga", action.payload);
        // Step 1: Get the current token from Redux
        const fullState: any = yield select((state) => state);
        //console.log("Full Redux State:", fullState);
        //const state: RootState = (yield select(sampleSelector)) as RootState;
        let token = fullState.sample.token;
        //console.log("token:", token);
        // Step 2: If token is null, fetch a new one
        if (!token) {
            // console.log("in if:");
            //const authResponse: { token: string } = (yield call(fetchAuthToken)) as { token: string };
            const authToken: string = (yield call(fetchAuthToken)) as string;
            //console.log("token2" ,authToken)
            token = authToken;
            yield put(sampleAction.setAuthToken(token));
        }
        // Step 3: Call Location API with token
        const response: any = yield call(fetchLocation, token, action.payload);
        yield put(sampleAction.getSampleSuccess(response));
    } catch (error: any) {
        yield put(sampleAction.getSampleFailure(error.message));
    }
}

// Saga to fetch checked-in users
function* fetchCheckedInUsersSaga(action: ReturnType<typeof sampleAction.getCheckedInUsersRequest>): Generator {

    try {

        console.log('in fecth api fetchCheckedInUsersSaga')

        const fullState = yield select((state) => state);
        let token = fullState.sample.token;

        // If token is null, fetch a new one
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(sampleAction.setAuthToken(token));
        }
        // Extract user ID from action payload
        const userId = action.payload;
        // Call API to fetch checked-in users
        const response: any = yield call(fetchCheckedInUsersAPI, userId, token);
        yield put(sampleAction.getCheckedInUsersSuccess(response));
    } catch (error: any) {
        yield put(sampleAction.getCheckedInUsersFailure(error.message));
    }
}

function* usersLocationCheckedInSaga(action: ReturnType<typeof sampleAction.getCheckedInUsersRequest>): Generator {

    try {

        console.log('in fecth api usersLocationCheckedInSaga')

        const fullState = yield select((state) => state);
        let token = fullState.sample.token;
        // If token is null, fetch a new one
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(sampleAction.setAuthToken(token));
        }
        // Extract user ID from action payload
        //const userId = action.payload;
        console.log(action.payload)
        // Call API to fetch checked-in users
        const response: any = yield call(userLocationcheckin, token, action.payload);
        yield put(sampleAction.userCheckingSuccess(response));
    } catch (error: any) {
        yield put(sampleAction.userCheckingFailure(error.message));
    }
}

// Saga to fetch nearby users
function* fetchNearbyUsersSaga(action: ReturnType<typeof sampleAction.getNearbyUsersRequest>): Generator {
    try {
        console.log('in fetch api fetchNearbyUsersSaga');

        const fullState = yield select((state) => state);
        let token = fullState.sample.token;

        // If token is null, fetch a new one
        if (!token) {
            token = (yield call(fetchAuthToken)) as string;
            yield put(sampleAction.setAuthToken(token));
        }

        // Call API to fetch nearby users
        const response: any = yield call(fetchNearbyUsersAPI, token, action.payload);
        yield put(sampleAction.getNearbyUsersSuccess(response));
    } catch (error: any) {
        yield put(sampleAction.getNearbyUsersFailure(error.message));
    }
}


// Saga to fetch online users at a specific place
function* fetchOnlineUsersAtPlaceSaga(action: ReturnType<typeof sampleAction.getOnlineUsersAtPlaceRequest>): Generator {
    try {
        console.log('🔍 fetchOnlineUsersAtPlaceSaga started for place:', action.payload);

        const fullState = yield select((state) => state);
        let token = fullState.sample.token;

        console.log('📌 Current token in saga:', token ? 'Present' : 'Missing');

        // If token is null, fetch a new one
        if (!token) {
            console.log('⚠️  No token, fetching new one...');
            token = (yield call(fetchAuthToken)) as string;
            console.log('✅ New token fetched');
            yield put(sampleAction.setAuthToken(token));
        }

        // Call API to fetch online users at place
        console.log('📡 Calling getOnlineUsersAPI with place:', action.payload);
        const response: any = yield call(getOnlineUsersAPI, token, action.payload);
        console.log('📍 Full API Response from online-at-place:', JSON.stringify(response, null, 2));
        
        // Handle different response formats
        let onlineUsers = [];
        if (response && response.onlineUsers) {
            onlineUsers = Array.isArray(response.onlineUsers) ? response.onlineUsers : [];
            console.log('✅ Got onlineUsers array, length:', onlineUsers.length);
            console.log('✅ Users:', onlineUsers.map((u: any) => ({ id: u?.profileId, name: u?.name })));
        } else if (Array.isArray(response)) {
            onlineUsers = response;
            console.log('✅ Response is array, length:', onlineUsers.length);
        } else {
            console.warn('⚠️  Unexpected response format:', response);
        }

        // Always dispatch with proper format
        yield put(sampleAction.getOnlineUsersAtPlaceSuccess({ 
            onlineUsers: onlineUsers,
            placeName: action.payload,
            count: onlineUsers.length 
        }));
        
        console.log('✅ Dispatched success with', onlineUsers.length, 'users');
    } catch (error: any) {
        console.error('❌ Error in fetchOnlineUsersAtPlaceSaga:', error?.message || error);
        console.error('❌ Full error:', error);
        yield put(sampleAction.getOnlineUsersAtPlaceFailure(error?.message || 'Unknown error'));
    }
}

export default function* locationSaga() {
    yield takeLatest(sampleAction.getSampleRequest.type, fetchLocationSaga);
    yield takeLatest(sampleAction.getCheckedInUsersRequest.type, fetchCheckedInUsersSaga);
    yield takeLatest(sampleAction.userCheckingRequest.type, usersLocationCheckedInSaga);
    yield takeLatest(sampleAction.getNearbyUsersRequest.type, fetchNearbyUsersSaga);
    yield takeLatest(sampleAction.getOnlineUsersAtPlaceRequest.type, fetchOnlineUsersAtPlaceSaga);
}
