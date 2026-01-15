import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScreenWrapper from '../../components/layout/Layout';
import CompassCircle from '../../components/qibla/CompassCircle';
import QiblaStatus from '../../components/qibla/QiblaStatus';
import CalibrationMessage from '../../components/qibla/CalibrationMessage';

// Services
import { getCurrentLocation } from '../../services/locationService';
import { subscribeMagnetometer } from '../../services/compassService';
import { calculateQiblaAngle } from '../../services/qiblaCalculator';

// Redux actions
import { setLocation, setPermissionStatus, setLocationError, setLocationLoading } from '../../redux/features/location/locationSlice';
import { updateHeading, updateMagneticField } from '../../redux/features/qibla/compassSlice';
import { setQiblaAngle, updateRelativeAngle } from '../../redux/features/qibla/qiblaSlice';

const QiblaScreen = () => {
    const dispatch = useDispatch();
    const { latitude, longitude, permissionStatus } = useSelector(state => state.location);
    const [isInitializing, setIsInitializing] = useState(!(latitude && longitude));
    const magnetometerSubscription = useRef(null);
    const { heading, needsCalibration } = useSelector(state => state.compass);
    const { qiblaAngle, relativeAngle, isFound } = useSelector(state => state.qibla);

    // Initialize: Get location and start sensors
    useEffect(() => {
        initializeQiblaFinder();

        return () => {
            // Cleanup: Unsubscribe from magnetometer
            if (magnetometerSubscription.current) {
                magnetometerSubscription.current.unsubscribe();
            }
        };
    }, []);

    // Calculate Qibla when location changes
    useEffect(() => {
        if (latitude && longitude) {
            try {
                const angle = calculateQiblaAngle(latitude, longitude);
                dispatch(setQiblaAngle(angle));
            } catch (error) {
                console.error('Qibla calculation error:', error);
            }
        }
    }, [latitude, longitude]);

    // Update relative angle when heading or qibla changes
    useEffect(() => {
        if (qiblaAngle !== null) {
            dispatch(updateRelativeAngle({ heading, qiblaAngle }));
        }
    }, [heading, qiblaAngle]);

    const initializeQiblaFinder = async () => {
        try {
            // Step 1: Get GPS location
            dispatch(setLocationLoading(true));

            getCurrentLocation(
                (location) => {
                    dispatch(setLocation({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }));
                    dispatch(setPermissionStatus('granted'));
                    dispatch(setLocationLoading(false));

                    // Step 2: Start magnetometer
                    startMagnetometer();

                    setIsInitializing(false);
                },
                (error) => {
                    dispatch(setLocationError(error));
                    dispatch(setLocationLoading(false));
                    setIsInitializing(false);

                    Alert.alert(
                        'Location Error',
                        error,
                        [{ text: 'Retry', onPress: initializeQiblaFinder }]
                    );
                }
            );
        } catch (error) {
            console.error('Initialization error:', error);
            setIsInitializing(false);
        }
    };

    const startMagnetometer = () => {
        const subscription = subscribeMagnetometer(
            (data) => {
                dispatch(updateHeading(data.heading));
                dispatch(updateMagneticField({
                    x: data.x,
                    y: data.y,
                    z: data.z,
                }));
            },
            (error) => {
                console.error('Magnetometer error:', error);
            }
        );

        magnetometerSubscription.current = subscription;
    };

    if (isInitializing) {
        return (
            <ScreenWrapper>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1A5246" />
                    <Text style={styles.loadingText}>Initializing Qibla Finder...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper scroll={true} showBackground={false} backgroundColor="white"    >
            <View style={styles.container}>
                <View style={styles.disclaimerContainer}>
                    <Text style={styles.disclaimerIcon}>⚠️</Text>
                    <Text style={styles.disclaimerText}>
                        This compass uses your device sensors and may not be 100% accurate.
                        For precise direction, please verify with local mosque or Islamic center.
                    </Text>
                </View>
                {/* Location Info Card */}
                {/* {latitude && longitude && (
                    <View style={styles.locationCard}>
                        <Text style={styles.locationLabel}>📍 Your Location</Text>
                        <Text style={styles.locationCoords}>
                            {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
                        </Text>
                    </View>
                )} */}

                {/* Kaaba Image */}
                <View style={styles.kaabaContainer}>
                    <Image
                        source={require('../../assets/kabba.png')}
                        style={styles.kaabaImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Compass */}
                <View style={styles.compassContainer}>
                    <CompassCircle
                        relativeAngle={relativeAngle}
                        qiblaFound={isFound}
                    />
                </View>

                {/* Qibla Status (Angle + Badge) */}
                <QiblaStatus
                    qiblaAngle={qiblaAngle}
                    isFound={isFound}
                    relativeAngle={relativeAngle}
                />

                {/* Calibration Message */}
                <CalibrationMessage needsCalibration={needsCalibration} />

                {/* Disclaimer */}


                {/* Info Footer */}
                <View style={styles.infoFooter}>
                    <Text style={styles.infoText}>🕋 Kaaba: 21.4225°N, 39.8262°E</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    locationCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#1A5246',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    locationLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    locationCoords: {
        fontSize: 14,
        color: '#1A5246',
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    kaabaContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    kaabaImage: {
        width: 200,
        height: 120,
    },
    compassContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    disclaimerContainer: {
        backgroundColor: '#FFF9E6',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFD700',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    disclaimerIcon: {
        fontSize: 20,
        marginRight: 10,
        marginTop: 2,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: '#856404',
        lineHeight: 18,
        fontWeight: '500',
    },
    infoFooter: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 11,
        color: '#999',
        fontFamily: 'monospace',
    },
});

export default QiblaScreen;