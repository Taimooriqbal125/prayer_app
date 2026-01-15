import { magnetometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';

// Set update interval to 100ms for smooth compass updates
setUpdateIntervalForType(SensorTypes.magnetometer, 100);

/**
 * Subscribe to magnetometer readings
 * @param {Function} onUpdate - Callback with {x, y, z, heading}
 * @returns {Subscription} RxJS subscription - call .unsubscribe() to stop
 */
export const subscribeMagnetometer = (onUpdate, onError) => {
    const subscription = magnetometer.subscribe(
        ({ x, y, z }) => {
            // Calculate heading from magnetometer data
            // atan2(y, x) gives angle in radians from magnetic north
            let heading = Math.atan2(y, x) * (180 / Math.PI);

            // Normalize to 0-359 degrees
            heading = (heading + 360) % 360;

            onUpdate?.({
                x,
                y,
                z,
                heading,
                magnitude: Math.sqrt(x * x + y * y + z * z),
                timestamp: Date.now(),
            });
        },
        (error) => {
            console.error('Magnetometer error:', error);
            onError?.(error);
        }
    );

    return subscription;
};

/**
 * Check if device magnetometer is available
 * @returns {Promise<boolean>}
 */
export const checkMagnetometerAvailability = async () => {
    try {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                subscription.unsubscribe();
                resolve(false);
            }, 1000);

            const subscription = magnetometer.subscribe(
                () => {
                    clearTimeout(timeout);
                    subscription.unsubscribe();
                    resolve(true);
                },
                () => {
                    clearTimeout(timeout);
                    resolve(false);
                }
            );
        });
    } catch (error) {
        console.error('Magnetometer check failed:', error);
        return false;
    }
};
