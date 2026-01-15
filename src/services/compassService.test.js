import { subscribeMagnetometer, checkMagnetometerAvailability } from './compassService';
// Mock needs to be defined before import or use jest.mock factory
import { magnetometer } from 'react-native-sensors';

// Mock react-native-sensors
const mockUnsubscribe = jest.fn();
const mockSubscribe = jest.fn();

jest.mock('react-native-sensors', () => ({
    SensorTypes: { magnetometer: 'magnetometer' },
    setUpdateIntervalForType: jest.fn(),
    magnetometer: {
        subscribe: jest.fn(),
    },
}));

describe('compassService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default subscribe behavior: returns an object with unsubscribe
        magnetometer.subscribe.mockReturnValue({ unsubscribe: mockUnsubscribe });
    });

    describe('subscribeMagnetometer', () => {
        it('should subscribe to magnetometer and return subscription', () => {
            const onUpdate = jest.fn();
            const sub = subscribeMagnetometer(onUpdate);

            expect(magnetometer.subscribe).toHaveBeenCalled();
            expect(sub).toHaveProperty('unsubscribe');
        });

        it('should calculate accurate heading (North)', () => {
            let updateCallback;
            magnetometer.subscribe.mockImplementation((cb) => {
                updateCallback = cb;
                return { unsubscribe: mockUnsubscribe };
            });

            const onUpdate = jest.fn();
            subscribeMagnetometer(onUpdate);

            // North: x=0, y=1 (or similar alignment depending on axis, usually North implies y+)
            // atan2(y, x) -> atan2(1, 0) = 90 deg? 
            // Standard Compass: 0 is North. 
            // In RN sensors (usually): 
            // atan2(y, x) gives mathematical angle. 0 deg is usually East in math.
            // Let's trace the code: atan2(y, x) * (180/PI).
            // if y=10, x=0 -> 90 degrees.
            // if y=0, x=10 -> 0 degrees.

            // Trigger callback
            updateCallback({ x: 0, y: 10, z: 0 });

            expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({
                heading: 90,
                x: 0,
                y: 10
            }));
        });

        it('should normalize negative angles', () => {
            let updateCallback;
            magnetometer.subscribe.mockImplementation((cb) => {
                updateCallback = cb;
                return { unsubscribe: mockUnsubscribe };
            });

            const onUpdate = jest.fn();
            subscribeMagnetometer(onUpdate);

            // South-Eastish check or just forcing negative math result
            // x = 10, y = -10
            // atan2(-10, 10) = -45 degrees
            // Normalized: -45 + 360 = 315 degrees
            updateCallback({ x: 10, y: -10, z: 0 });

            expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({
                heading: 315
            }));
        });

        it('should calculate magnitude correctly', () => {
            let updateCallback;
            magnetometer.subscribe.mockImplementation((cb) => {
                updateCallback = cb;
                return { unsubscribe: mockUnsubscribe };
            });

            const onUpdate = jest.fn();
            subscribeMagnetometer(onUpdate);

            // 3-4-5 triangle for simple math (z=0)
            updateCallback({ x: 3, y: 4, z: 0 });

            expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({
                magnitude: 5
            }));
        });

        it('should handle errors', () => {
            let errorCallback;
            magnetometer.subscribe.mockImplementation((_, errCb) => {
                errorCallback = errCb;
                return { unsubscribe: mockUnsubscribe };
            });

            const onError = jest.fn();
            subscribeMagnetometer(jest.fn(), onError);

            const err = new Error('Sensor fail');
            errorCallback(err);

            expect(onError).toHaveBeenCalledWith(err);
        });
    });

    describe('checkMagnetometerAvailability', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should return true if data received within timeout', async () => {
            magnetometer.subscribe.mockImplementation((cb) => {
                // Determine if we want to fire immediately or via timeout
                // For "availability", the real code waits for first emission.
                // We'll simulate emission right away (or next tick)
                setTimeout(() => cb({ x: 1, y: 1, z: 1 }), 10);
                return { unsubscribe: mockUnsubscribe };
            });

            const promise = checkMagnetometerAvailability();

            // Fast forward time past the simulated emission delay (10ms) but before timeout (1000ms)
            jest.advanceTimersByTime(50);

            const result = await promise;
            expect(result).toBe(true);
            expect(mockUnsubscribe).toHaveBeenCalled();
        });

        it('should return false if timeout reached', async () => {
            // Subscribe but never call back
            magnetometer.subscribe.mockImplementation(() => {
                return { unsubscribe: mockUnsubscribe };
            });

            const promise = checkMagnetometerAvailability();

            // Advance past 1000ms
            jest.advanceTimersByTime(1100);

            const result = await promise;
            expect(result).toBe(false);
            expect(mockUnsubscribe).toHaveBeenCalled();
        });

        it('should return false on error', async () => {
            // Simulate direct error throw or sync error in subscribe if possible?
            // The function uses subscribe(success, error).
            // The service code: try { ... subscribe(..., errorHandler) }
            // The errorHandler calls clearTimeout and resolves false.

            magnetometer.subscribe.mockImplementation((_, errCb) => {
                setTimeout(() => errCb(new Error('Fail')), 50);
                return { unsubscribe: mockUnsubscribe };
            });

            const promise = checkMagnetometerAvailability();
            jest.advanceTimersByTime(100);

            const result = await promise;
            expect(result).toBe(false);
        });
    });
});
