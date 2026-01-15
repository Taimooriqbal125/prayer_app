import qiblaReducer, {
    setQiblaAngle,
    updateRelativeAngle,
    setCalculating,
    setQiblaError,
    resetQibla,
} from './qiblaSlice';

describe('qiblaSlice', () => {
    const initialState = {
        qiblaAngle: null,
        relativeAngle: 0,
        isFound: false,
        calculating: false,
        error: null,
    };

    it('should return the initial state', () => {
        expect(qiblaReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle setQiblaAngle', () => {
        const state = qiblaReducer(initialState, setQiblaAngle(135));
        expect(state.qiblaAngle).toBe(135);
        expect(state.calculating).toBe(false);
        expect(state.error).toBeNull();
    });

    it('should handle updateRelativeAngle when qiblaAngle is set', () => {
        const startState = {
            ...initialState,
            qiblaAngle: 100,
        };

        // Heading 100 (pointing directly at Qibla)
        // Diff = 100 - 100 = 0
        let state = qiblaReducer(startState, updateRelativeAngle({ heading: 100, qiblaAngle: 100 }));
        expect(state.relativeAngle).toBe(0);
        expect(state.isFound).toBe(true); // Within ±5 degrees

        // Heading 110 (off by 10)
        // Diff = 110 - 100 = 10
        state = qiblaReducer(startState, updateRelativeAngle({ heading: 110, qiblaAngle: 100 }));
        expect(state.relativeAngle).toBe(10);
        expect(state.isFound).toBe(false);

        // Heading 0 (Qibla at 100)
        // Diff = 0 - 100 = -100
        state = qiblaReducer(startState, updateRelativeAngle({ heading: 0, qiblaAngle: 100 }));
        expect(state.relativeAngle).toBe(-100);
    });

    it('should handle updateRelativeAngle normalization', () => {
        const startState = { ...initialState, qiblaAngle: 350 };

        // Heading 10 (User is at 10 degrees, Qibla at 350)
        // Diff = 10 - 350 = -340
        // Normalized: -340 + 360 = 20
        const state = qiblaReducer(startState, updateRelativeAngle({ heading: 10, qiblaAngle: 350 }));
        expect(state.relativeAngle).toBe(20);
        expect(state.isFound).toBe(false); // 20 > 5
    });

    it('should ignore updateRelativeAngle if qiblaAngle is null', () => {
        const state = qiblaReducer(initialState, updateRelativeAngle({ heading: 100, qiblaAngle: null }));
        expect(state.relativeAngle).toBe(0); // Unchanged
    });

    it('should handle setCalculating', () => {
        const state = qiblaReducer(initialState, setCalculating(true));
        expect(state.calculating).toBe(true);
    });

    it('should handle setQiblaError', () => {
        const state = qiblaReducer(initialState, setQiblaError('Calculation Failed'));
        expect(state.error).toBe('Calculation Failed');
        expect(state.calculating).toBe(false);
    });

    it('should handle resetQibla', () => {
        const dirtyState = { ...initialState, calculating: true };
        const state = qiblaReducer(dirtyState, resetQibla());
        expect(state).toEqual(initialState);
    });
});
