// Kaaba coordinates (Mecca, Saudi Arabia)
export const KAABA_LATITUDE = 21.4225;
export const KAABA_LONGITUDE = 39.8262;

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => degrees * (Math.PI / 180);

/**
 * Convert radians to degrees
 */
const toDegrees = (radians) => radians * (180 / Math.PI);

/**
 * Calculate the Qibla direction (bearing) from user's location to Kaaba
 * 
 * Uses the formula for calculating bearing between two points on Earth:
 * θ = atan2(sin(Δλ) ⋅ cos(φ₂), cos(φ₁) ⋅ sin(φ₂) − sin(φ₁) ⋅ cos(φ₂) ⋅ cos(Δλ))
 * 
 * @param {number} userLatitude - User's latitude in degrees
 * @param {number} userLongitude - User's longitude in degrees
 * @returns {number} Qibla direction in degrees (0-359), where 0° is North
 */
export const calculateQiblaAngle = (userLatitude, userLongitude) => {
    if (userLatitude == null || userLongitude == null) {
        throw new Error('User coordinates are required');
    }

    // Convert coordinates to radians
    const φ1 = toRadians(userLatitude);
    const φ2 = toRadians(KAABA_LATITUDE);
    const Δλ = toRadians(KAABA_LONGITUDE - userLongitude);

    // Calculate bearing using the formula
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    let θ = Math.atan2(y, x);

    // Convert to degrees
    θ = toDegrees(θ);

    // Normalize to 0-359 degrees
    θ = (θ + 360) % 360;

    return θ;
};

/**
 * Calculate the distance to Kaaba in kilometers
 * Uses the Haversine formula
 */
export const calculateDistanceToKaaba = (userLatitude, userLongitude) => {
    const R = 6371; // Earth's radius in km

    const φ1 = toRadians(userLatitude);
    const φ2 = toRadians(KAABA_LATITUDE);
    const Δφ = toRadians(KAABA_LATITUDE - userLatitude);
    const Δλ = toRadians(KAABA_LONGITUDE - userLongitude);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};
