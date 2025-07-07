import { all, fork, AllEffect, ForkEffect } from "redux-saga/effects";
import locationSaga from "./locationSaga"; // Ensure correct path
import profileSaga from "./profileSaga";

export default function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
    yield all([
        fork(locationSaga),
        fork(profileSaga)
    ]);
}