import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    heading: 0, // Current phone heading in degrees (0-359)
    accuracy: 0,
    magneticField: { x: 0, y: 0, z: 0 },
    needsCalibration: false,
    isCalibrating: false,
    lastUpdate: null,
};

const compassSlice = createSlice({
    name: 'compass',
    initialState,
    reducers: {
        updateHeading: (state, action) => {
            state.heading = action.payload;
            state.lastUpdate = Date.now();
        },
        updateMagneticField: (state, action) => {
            state.magneticField = action.payload;

            // Check if calibration is needed based on magnetic field strength
            const magnitude = Math.sqrt(
                action.payload.x ** 2 +
                action.payload.y ** 2 +
                action.payload.z ** 2
            );

            // Typical Earth's magnetic field is 25-65 µT
            // If too low or unstable, calibration needed
            state.needsCalibration = magnitude < 20 || magnitude > 100;
        },
        setAccuracy: (state, action) => {
            state.accuracy = action.payload;
        },
        setCalibrating: (state, action) => {
            state.isCalibrating = action.payload;
            if (action.payload) {
                state.needsCalibration = false;
            }
        },
        resetCompass: () => initialState,
    },
});

export const {
    updateHeading,
    updateMagneticField,
    setAccuracy,
    setCalibrating,
    resetCompass,
} = compassSlice.actions;

export default compassSlice.reducer;
