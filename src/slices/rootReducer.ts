import { combineReducers } from "@reduxjs/toolkit";
import { sampleReducer } from './sample';
import { profileReducer } from "./profile";

const rootReducer = combineReducers({
  sample: sampleReducer,
  profile: profileReducer,
});

export default rootReducer;
