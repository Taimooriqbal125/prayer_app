import { configureStore } from '@reduxjs/toolkit';
import appReducer from './features/app/appSlice';
import locationReducer from './features/location/locationSlice';
import compassReducer from './features/qibla/compassSlice';
import qiblaReducer from './features/qibla/qiblaSlice';
import { loadState, saveState } from './storage';

import tasbihReducer from './features/tasbih/tasbihSlice';
import prayerTimeReducer from './features/prayertime/prayerTimeSlice';
import surahReducer from '../redux/features/quran/surahSlice';

// 1. Load initial state from MMKV synchronously
const persistedAppState = loadState('app');
const persistedPrayerState = loadState('prayerTimes');
const persistedLocationState = loadState('location');
const persistedQuranState = loadState('quran');

const store = configureStore({
    reducer: {
        app: appReducer,
        location: locationReducer,
        compass: compassReducer,
        qibla: qiblaReducer,
        tasbih: tasbihReducer,
        prayerTimes: prayerTimeReducer,
        quran: surahReducer,
    },
    // Increase threshold for frequent sensor updates to avoid warnings in development
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: { warnAfter: 200 },
            serializableCheck: { warnAfter: 200 },
        }),
    // 2. Inject the persisted state as the preloadedState
    preloadedState: {
        app: persistedAppState,
        prayerTimes: persistedPrayerState,
        location: persistedLocationState,
        quran: persistedQuranState,
    },
});

// 3. Subscribe to store changes to automatically save slices
store.subscribe(() => {
    const state = store.getState();
    saveState('app', state.app);
    saveState('prayerTimes', state.prayerTimes);
    saveState('location', state.location);
    saveState('quran', state.quran);
});

export { store };
