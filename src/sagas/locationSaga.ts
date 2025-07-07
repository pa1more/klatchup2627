import { call, put, takeLatest, select } from "redux-saga/effects";
import { sampleAction, sampleSelector } from "../slices/sample";
import { fetchAuthToken, fetchLocation, fetchCheckedInUsersAPI, userLocationcheckin } from "../services/api";
import { RootState } from "../store"; // Import RootState


function* fetchLocationSaga(action: ReturnType<typeof sampleAction.getSampleRequest>): Generator {

    try {
        //console.log("Saga Triggered: fetchLocationSaga", action.payload);
        // Step 1: Get the current token from Redux
        const fullState = yield select((state) => state);
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


export default function* locationSaga() {
    yield takeLatest(sampleAction.getSampleRequest.type, fetchLocationSaga);
    yield takeLatest(sampleAction.getCheckedInUsersRequest.type, fetchCheckedInUsersSaga);
    yield takeLatest(sampleAction.userCheckingRequest.type, usersLocationCheckedInSaga);
}
