import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

/**
 * Get the appropriate location permission for the platform
 */
const getLocationPermission = () => {
    if (Platform.OS === 'android') {
        return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }
    return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
};

/**
 * Check if location permission is granted
 * @returns {Promise<boolean>}
 */
export const checkLocationPermission = async () => {
    try {
        const permission = getLocationPermission();
        const result = await check(permission);

        return result === RESULTS.GRANTED;
    } catch (error) {
        console.error('Error checking location permission:', error);
        return false;
    }
};

/**
 * Request location permission from the user
 * @returns {Promise<string>} Permission status: 'granted' | 'denied' | 'blocked'
 */
export const requestLocationPermission = async () => {
    try {
        const permission = getLocationPermission();
        const result = await request(permission);

        switch (result) {
            case RESULTS.GRANTED:
                return 'granted';
            case RESULTS.DENIED:
                return 'denied';
            case RESULTS.BLOCKED:
                return 'blocked';
            case RESULTS.UNAVAILABLE:
                return 'unavailable';
            default:
                return 'denied';
        }
    } catch (error) {
        console.error('Error requesting location permission:', error);
        return 'denied';
    }
};
