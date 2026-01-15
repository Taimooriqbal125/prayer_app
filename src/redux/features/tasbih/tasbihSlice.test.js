import tasbihReducer, {
    increment,
    reset,
    setLimit,
    nextPhrase,
    prevPhrase,
    resetSession,
} from './tasbihSlice';

describe('tasbihSlice', () => {
    const initialState = {
        count: 0,
        limit: 33,
        currentPhraseIndex: 0,
        phrases: [
            { id: 1, text: 'Subhanallah', translation: 'Glory be to Allah' },
            { id: 2, text: 'Alhamdulillah', translation: 'Praise be to Allah' },
            { id: 3, text: 'Allahu Akbar', translation: 'Allah is Greatest' },
            { id: 4, text: 'La ilaha illallah', translation: 'There is no god but Allah' },
        ],
        totalCount: 0,
    };

    it('should return initial state', () => {
        expect(tasbihReducer(undefined, {})).toEqual(initialState);
    });

    it('should increment count and totalCount', () => {
        const state = tasbihReducer(initialState, increment());
        expect(state.count).toBe(1);
        expect(state.totalCount).toBe(1);
    });

    it('should not increment beyond limit', () => {
        const atLimitState = { ...initialState, count: 33, limit: 33 };
        const state = tasbihReducer(atLimitState, increment());
        expect(state.count).toBe(33);
    });

    it('should reset count but keep totalCount', () => {
        const dirtyState = { ...initialState, count: 10, totalCount: 50 };
        const state = tasbihReducer(dirtyState, reset());
        expect(state.count).toBe(0);
        expect(state.totalCount).toBe(50);
    });

    it('should change limit and reset count', () => {
        const dirtyState = { ...initialState, count: 10 };
        const state = tasbihReducer(dirtyState, setLimit(100));
        expect(state.limit).toBe(100);
        expect(state.count).toBe(0);
    });

    it('should navigate to next phrase and reset count', () => {
        // Current index 0
        const state = tasbihReducer(initialState, nextPhrase());
        expect(state.currentPhraseIndex).toBe(1);
        expect(state.count).toBe(0);

        // Loop around
        const lastState = { ...initialState, currentPhraseIndex: 3 };
        const state2 = tasbihReducer(lastState, nextPhrase());
        expect(state2.currentPhraseIndex).toBe(0);
    });

    it('should navigate to prev phrase and reset count', () => {
        // Current index 0
        const state = tasbihReducer(initialState, prevPhrase());
        expect(state.currentPhraseIndex).toBe(3); // Loop back
        expect(state.count).toBe(0);

        // Normal prev
        const middleState = { ...initialState, currentPhraseIndex: 2 };
        const state2 = tasbihReducer(middleState, prevPhrase());
        expect(state2.currentPhraseIndex).toBe(1);
    });

    it('should reset session (count and totalCount)', () => {
        const dirtyState = { ...initialState, count: 10, totalCount: 100 };
        const state = tasbihReducer(dirtyState, resetSession());
        expect(state.count).toBe(0);
        expect(state.totalCount).toBe(0);
    });
});
