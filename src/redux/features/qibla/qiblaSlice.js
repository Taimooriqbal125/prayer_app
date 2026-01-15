import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    qiblaAngle: null, // Calculated Qibla direction from user's location
    relativeAngle: 0, // heading - qiblaAngle (for compass rotation)
    isFound: false, // True when phone is pointing towards Qibla (±5°)
    calculating: false,
    error: null,
};

const qiblaSlice = createSlice({
    name: 'qibla',
    initialState,
    reducers: {
        setQiblaAngle: (state, action) => {
            state.qiblaAngle = action.payload;
            state.calculating = false;
            state.error = null;
        },
        updateRelativeAngle: (state, action) => {
            const { heading, qiblaAngle } = action.payload;

            if (qiblaAngle !== null) {
                // Calculate relative angle for compass rotation
                let diff = heading - qiblaAngle;

                // Normalize to -180 to 180
                while (diff > 180) diff -= 360;
                while (diff < -180) diff += 360;

                state.relativeAngle = diff;

                // Check if Qibla is found (within ±5 degrees)
                state.isFound = Math.abs(diff) <= 5;
            }
        },
        setCalculating: (state, action) => {
            state.calculating = action.payload;
        },
        setQiblaError: (state, action) => {
            state.error = action.payload;
            state.calculating = false;
        },
        resetQibla: () => initialState,
    },
});

export const {
    setQiblaAngle,
    updateRelativeAngle,
    setCalculating,
    setQiblaError,
    resetQibla,
} = qiblaSlice.actions;

export default qiblaSlice.reducer;
