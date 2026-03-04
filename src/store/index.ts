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

// Verify store is properly initialized
if (!store) {
  throw new Error('Redux store failed to initialize');
}

if (typeof store.getState !== 'function') {
  throw new Error('Redux store.getState is not a function');
}

console.log("Redux Store Initialized");

try {
  sagaMiddleware.run(rootSaga);
  console.log("Saga Middleware Running...");
} catch (error) {
  console.error("Error starting saga middleware:", error);
  throw error;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store