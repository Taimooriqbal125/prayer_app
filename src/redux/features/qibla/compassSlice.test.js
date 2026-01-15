import compassReducer, {
    updateHeading,
    updateMagneticField,
    setAccuracy,
    setCalibrating,
    resetCompass,
} from './compassSlice';

describe('compassSlice', () => {
    const initialState = {
        heading: 0,
        accuracy: 0,
        magneticField: { x: 0, y: 0, z: 0 },
        needsCalibration: false,
        isCalibrating: false,
        lastUpdate: null,
    };

    it('should return the initial state', () => {
        expect(compassReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle updateHeading', () => {
        const state = compassReducer(initialState, updateHeading(90));
        expect(state.heading).toBe(90);
        expect(state.lastUpdate).not.toBeNull();
    });

    it('should handle updateMagneticField and detect normal field', () => {
        // Normal Magnitude (e.g., 50)
        // sqrt(30^2 + 40^2 + 0) = 50
        const payload = { x: 30, y: 40, z: 0 };
        const state = compassReducer(initialState, updateMagneticField(payload));
        expect(state.magneticField).toEqual(payload);
        expect(state.needsCalibration).toBe(false);
    });

    it('should handle updateMagneticField and detect calibration needed (Low)', () => {
        // Low Magnitude (e.g., 10)
        // sqrt(10^2) = 10 (< 20)
        const payload = { x: 10, y: 0, z: 0 };
        const state = compassReducer(initialState, updateMagneticField(payload));
        expect(state.needsCalibration).toBe(true);
    });

    it('should handle updateMagneticField and detect calibration needed (High)', () => {
        // High Magnitude (e.g., 150)
        const payload = { x: 150, y: 0, z: 0 };
        const state = compassReducer(initialState, updateMagneticField(payload));
        expect(state.needsCalibration).toBe(true);
    });

    it('should handle setCalibrating', () => {
        let state = compassReducer(initialState, { type: 'dummy' });
        // Set needsCalibration to true first
        state = { ...state, needsCalibration: true };

        // Start calibrating
        state = compassReducer(state, setCalibrating(true));
        expect(state.isCalibrating).toBe(true);
        expect(state.needsCalibration).toBe(false); // Should reset flag

        // Stop calibrating
        state = compassReducer(state, setCalibrating(false));
        expect(state.isCalibrating).toBe(false);
    });

    it('should handle setAccuracy', () => {
        const state = compassReducer(initialState, setAccuracy(3));
        expect(state.accuracy).toBe(3);
    });

    it('should handle resetCompass', () => {
        const dirtyState = { ...initialState, heading: 180 };
        const state = compassReducer(dirtyState, resetCompass());
        expect(state).toEqual(initialState);
    });
});
