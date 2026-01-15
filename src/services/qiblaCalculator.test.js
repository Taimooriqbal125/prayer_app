import { calculateQiblaAngle, calculateDistanceToKaaba, KAABA_LATITUDE, KAABA_LONGITUDE } from './qiblaCalculator';

describe('qiblaCalculator', () => {
    describe('calculateQiblaAngle', () => {
        it('should throw error if coordinates are missing', () => {
            expect(() => calculateQiblaAngle(null, 10)).toThrow('User coordinates are required');
            expect(() => calculateQiblaAngle(10, null)).toThrow('User coordinates are required');
        });

        it('should calculate correct Qibla angle for London', () => {
            // London: 51.5074° N, 0.1278° W
            // Expected Qibla: ~118.98°
            const lat = 51.5074;
            const lng = -0.1278;
            const angle = calculateQiblaAngle(lat, lng);
            expect(angle).toBeCloseTo(118.98, 1);
        });

        it('should calculate correct Qibla angle for New York', () => {
            // New York: 40.7128° N, 74.0060° W
            // Expected Qibla: ~58.48°
            const lat = 40.7128;
            const lng = -74.0060;
            const angle = calculateQiblaAngle(lat, lng);
            expect(angle).toBeCloseTo(58.48, 1);
        });

        it('should calculate correct Qibla angle for Tokyo', () => {
            // Tokyo: 35.6762° N, 139.6503° E
            // Expected Qibla: ~293.02°
            const lat = 35.6762;
            const lng = 139.6503;
            const angle = calculateQiblaAngle(lat, lng);
            expect(angle).toBeCloseTo(293.02, 1);
        });

        it('should return 0 (or close to) when directly South of Kaaba', () => {
            // Location: (KAABA_LATITUDE - 10), KAABA_LONGITUDE
            // Should point North (0 degrees)
            const lat = KAABA_LATITUDE - 10;
            const lng = KAABA_LONGITUDE;
            const angle = calculateQiblaAngle(lat, lng);
            expect(angle).toBeCloseTo(0, 0); // Precision 0 to allow minor floating point deviations
        });

        it('should return 180 (or close to) when directly North of Kaaba', () => {
            // Location: (KAABA_LATITUDE + 10), KAABA_LONGITUDE
            // Should point South (180 degrees)
            const lat = KAABA_LATITUDE + 10;
            const lng = KAABA_LONGITUDE;
            const angle = calculateQiblaAngle(lat, lng);
            expect(angle).toBeCloseTo(180, 0);
        });
    });

    describe('calculateDistanceToKaaba', () => {
        it('should calculate approximate distance from London', () => {
            // London distance ~4790 km
            const lat = 51.5074;
            const lng = -0.1278;
            const dist = calculateDistanceToKaaba(lat, lng);
            // Allow range due to simplified Earth radius constant
            expect(dist).toBeGreaterThan(4700);
            expect(dist).toBeLessThan(4900);
        });

        it('should return 0 if at Kaaba', () => {
            const dist = calculateDistanceToKaaba(KAABA_LATITUDE, KAABA_LONGITUDE);
            expect(dist).toBeCloseTo(0);
        });
    });
});
