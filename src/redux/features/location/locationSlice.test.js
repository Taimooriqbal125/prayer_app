import locationReducer, {
    setLocation,
    setPermissionStatus,
    setLocationError,
    setLocationLoading,
    resetLocation,
} from './locationSlice';

describe('locationSlice', () => {
    const initialState = {
        latitude: null,
        longitude: null,
        permissionStatus: 'undetermined',
        error: null,
        isLoading: false,
    };

    it('should return the initial state', () => {
        expect(locationReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle setLocation', () => {
        const payload = { latitude: 33.68, longitude: 73.04 };
        const state = locationReducer(initialState, setLocation(payload));
        expect(state).toEqual({
            ...initialState,
            latitude: 33.68,
            longitude: 73.04,
            error: null,
        });
    });

    it('should handle setPermissionStatus', () => {
        const state = locationReducer(initialState, setPermissionStatus('granted'));
        expect(state.permissionStatus).toEqual('granted');
    });

    it('should handle setLocationError', () => {
        const errorMsg = 'Permission denied';
        const state = locationReducer(initialState, setLocationError(errorMsg));
        expect(state.error).toEqual(errorMsg);
    });

    it('should handle setLocationLoading', () => {
        const state = locationReducer(initialState, setLocationLoading(true));
        expect(state.isLoading).toBe(true);
    });

    it('should handle resetLocation', () => {
        // Create a modified state
        const modifiedState = {
            latitude: 10,
            longitude: 10,
            permissionStatus: 'granted',
            error: 'Old Error',
            isLoading: true,
        };

        const state = locationReducer(modifiedState, resetLocation());
        expect(state).toEqual(initialState);
    });

    it('should clear error when new location is set', () => {
        const errorState = {
            ...initialState,
            error: 'Some Error'
        };
        const payload = { latitude: 10, longitude: 10 };
        const state = locationReducer(errorState, setLocation(payload));
        expect(state.error).toBeNull();
    });
});
