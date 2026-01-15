import { checkLocationPermission, requestLocationPermission } from './permissionsService';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import { Platform } from 'react-native';

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
    check: jest.fn(),
    request: jest.fn(),
    PERMISSIONS: {
        ANDROID: { ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION' },
        IOS: { LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE' },
    },
    RESULTS: {
        GRANTED: 'granted',
        DENIED: 'denied',
        BLOCKED: 'blocked',
        UNAVAILABLE: 'unavailable',
    },
}));

describe('permissionsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkLocationPermission', () => {
        it('should check android permission on Android', async () => {
            Platform.OS = 'android';
            check.mockResolvedValue(RESULTS.GRANTED);

            const result = await checkLocationPermission();

            expect(check).toHaveBeenCalledWith(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            expect(result).toBe(true);
        });

        it('should check ios permission on iOS', async () => {
            Platform.OS = 'ios';
            check.mockResolvedValue(RESULTS.DENIED);

            const result = await checkLocationPermission();

            expect(check).toHaveBeenCalledWith(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            expect(result).toBe(false);
        });

        it('should handle errors gracefully', async () => {
            check.mockRejectedValue(new Error('Permission check failed'));
            const result = await checkLocationPermission();
            expect(result).toBe(false);
        });
    });

    describe('requestLocationPermission', () => {
        it('should return "granted" when permission granted', async () => {
            Platform.OS = 'android';
            request.mockResolvedValue(RESULTS.GRANTED);

            const result = await requestLocationPermission();

            expect(request).toHaveBeenCalledWith(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            expect(result).toBe('granted');
        });

        it('should return "denied" when permission denied', async () => {
            request.mockResolvedValue(RESULTS.DENIED);
            const result = await requestLocationPermission();
            expect(result).toBe('denied');
        });

        it('should return "blocked" when permission blocked', async () => {
            request.mockResolvedValue(RESULTS.BLOCKED);
            const result = await requestLocationPermission();
            expect(result).toBe('blocked');
        });

        it('should return "unavailable" when permission unavailable', async () => {
            request.mockResolvedValue(RESULTS.UNAVAILABLE);
            const result = await requestLocationPermission();
            expect(result).toBe('unavailable');
        });

        it('should default to "denied" for unknown results', async () => {
            request.mockResolvedValue('unknown_status');
            const result = await requestLocationPermission();
            expect(result).toBe('denied');
        });

        it('should handle errors gracefully and return denied', async () => {
            request.mockRejectedValue(new Error('Request fail'));
            const result = await requestLocationPermission();
            expect(result).toBe('denied');
        });
    });
});
