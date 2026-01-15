import { getCurrentLocation, watchLocation, clearLocationWatch } from './locationService';
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from './permissionsService';

// Mock dependencies
jest.mock('react-native-geolocation-service', () => ({
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
}));

jest.mock('./permissionsService', () => ({
    requestLocationPermission: jest.fn(),
}));

describe('locationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrentLocation', () => {
        it('should return location when permission is granted and geolocation succeeds', async () => {
            // Mock permission success
            requestLocationPermission.mockResolvedValue('granted');

            // Mock geolocation success
            const mockPosition = {
                coords: { latitude: 10, longitude: 20, accuracy: 5 },
                timestamp: 123456789
            };

            Geolocation.getCurrentPosition.mockImplementation((success, error, options) => {
                success(mockPosition);
            });

            const onSuccess = jest.fn();
            const onError = jest.fn();

            await getCurrentLocation(onSuccess, onError);

            expect(requestLocationPermission).toHaveBeenCalled();
            expect(Geolocation.getCurrentPosition).toHaveBeenCalledWith(
                expect.any(Function),
                expect.any(Function),
                expect.objectContaining({ enableHighAccuracy: true })
            );
            expect(onSuccess).toHaveBeenCalledWith({
                latitude: 10,
                longitude: 20,
                accuracy: 5,
                timestamp: 123456789
            });
            expect(onError).not.toHaveBeenCalled();
        });

        it('should fail if permission is denied', async () => {
            requestLocationPermission.mockResolvedValue('denied');

            const onSuccess = jest.fn();
            const onError = jest.fn();

            await getCurrentLocation(onSuccess, onError);

            expect(requestLocationPermission).toHaveBeenCalled();
            expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(expect.stringContaining('Permission denied'));
        });

        it('should fail if geolocation returns error', async () => {
            requestLocationPermission.mockResolvedValue('granted');

            Geolocation.getCurrentPosition.mockImplementation((success, error, options) => {
                error({ code: 1, message: 'Timeout' });
            });

            const onSuccess = jest.fn();
            const onError = jest.fn();

            await getCurrentLocation(onSuccess, onError);

            expect(onError).toHaveBeenCalledWith('Timeout');
        });

        it('should fail if permissions service throws', async () => {
            requestLocationPermission.mockRejectedValue(new Error('Service Fail'));

            const onSuccess = jest.fn();
            const onError = jest.fn();

            await getCurrentLocation(onSuccess, onError);

            expect(onError).toHaveBeenCalledWith('Service Fail');
        });
    });

    describe('watchLocation', () => {
        it('should start watching position and return watchId', () => {
            Geolocation.watchPosition.mockReturnValue(12345);

            // Simulate update
            Geolocation.watchPosition.mockImplementation((success) => {
                success({ coords: { latitude: 1, longitude: 1, accuracy: 1 } });
                return 12345;
            });

            const onUpdate = jest.fn();
            const watchId = watchLocation(onUpdate);

            expect(watchId).toBe(12345);
            expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ latitude: 1 }));
        });

        it('should handle watch errors', () => {
            Geolocation.watchPosition.mockImplementation((_, error) => {
                error({ message: 'Watch fail' });
                return 0;
            });

            const onError = jest.fn();
            watchLocation(jest.fn(), onError);

            expect(onError).toHaveBeenCalledWith('Watch fail');
        });
    });

    describe('clearLocationWatch', () => {
        it('should clear watch if ID is provided', () => {
            clearLocationWatch(123);
            expect(Geolocation.clearWatch).toHaveBeenCalledWith(123);
        });

        it('should do nothing if no ID provided', () => {
            clearLocationWatch(null);
            expect(Geolocation.clearWatch).not.toHaveBeenCalled();
        });
    });
});
