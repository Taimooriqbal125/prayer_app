import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from './permissionsService';

/**
 * Get the current GPS position
 * @param {Function} onSuccess - Callback with {latitude, longitude}
 * @param {Function} onError - Callback with error message
 */
export const getCurrentLocation = async (onSuccess, onError) => {
    try {
        // Check/request permission first
        const permissionStatus = await requestLocationPermission();

        if (permissionStatus !== 'granted') {
            onError?.('Permission denied for location access');
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                onSuccess?.({
                    latitude,
                    longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                console.error('Geolocation error:', error);
                onError?.(error.message || 'Failed to get location');
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    } catch (error) {
        console.error('Location service error:', error);
        onError?.(error.message || 'Location service failed');
    }
};

/**
 * Watch position changes (for continuous tracking)
 * @param {Function} onUpdate - Callback with location updates
 * @returns {number} watchId - Use to clear watch later
 */
export const watchLocation = (onUpdate, onError) => {
    const watchId = Geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            onUpdate?.({
                latitude,
                longitude,
                accuracy: position.coords.accuracy,
            });
        },
        (error) => {
            console.error('Watch position error:', error);
            onError?.(error.message);
        },
        {
            enableHighAccuracy: true,
            distanceFilter: 10, // Update every 10 meters
            interval: 5000, // Update every 5 seconds
            fastestInterval: 2000,
        }
    );

    return watchId;
};

/**
 * Stop watching location
 */
export const clearLocationWatch = (watchId) => {
    if (watchId) {
        Geolocation.clearWatch(watchId);
    }
};
