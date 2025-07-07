import createSagaMiddleware from 'redux-saga';
import rootReducer from '../slices/rootReducer';
import rootSaga from '../sagas/rootSaga';
import { configureStore } from '@reduxjs/toolkit';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false, }).concat(sagaMiddleware),
});
if (!store || typeof store.getState !== 'function') {
  console.error('Store is undefined or invalid');
}

console.log("Redux Store Initialized");
sagaMiddleware.run(rootSaga);
console.log("Saga Middleware Running...");

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store