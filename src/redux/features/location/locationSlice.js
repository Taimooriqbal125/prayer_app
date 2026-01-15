import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    latitude: null,
    longitude: null,
    permissionStatus: 'undetermined', // 'granted' | 'denied' | 'undetermined'
    error: null,
    isLoading: false,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.error = null;
        },
        setPermissionStatus: (state, action) => {
            state.permissionStatus = action.payload;
        },
        setLocationError: (state, action) => {
            state.error = action.payload;
        },
        setLocationLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        resetLocation: () => initialState,
    },
});

export const {
    setLocation,
    setPermissionStatus,
    setLocationError,
    setLocationLoading,
    resetLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
