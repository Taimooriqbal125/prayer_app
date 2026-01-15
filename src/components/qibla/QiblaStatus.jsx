import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QiblaStatus = ({ qiblaAngle, isFound, relativeAngle }) => {
    return (
        <View style={styles.container}>
            {/* Angle Display */}
            <View style={styles.angleContainer}>
                <Text style={styles.angleText}>
                    {qiblaAngle !== null ? `${qiblaAngle.toFixed(2)}°` : '--°'}
                </Text>
            </View>

            {/* Status Badge */}
            <View style={[styles.badge, isFound && styles.badgeActive]}>
                <Text style={[styles.badgeText, isFound && styles.badgeTextActive]}>
                    {isFound ? '✓ Qibla Found' : 'Finding Qibla...'}
                </Text>
            </View>

            {/* Relative Angle Info (for debugging, can be removed) */}
            {__DEV__ && (
                <Text style={styles.debugText}>
                    Relative: {relativeAngle?.toFixed(1)}°
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    angleContainer: {
        marginBottom: 15,
    },
    angleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 1,
    },
    badge: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
    },
    badgeActive: {
        backgroundColor: '#2E8B57',
    },
    badgeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    badgeTextActive: {
        color: '#FFFFFF',
    },
    debugText: {
        marginTop: 10,
        fontSize: 12,
        color: '#999',
    },
});

export default QiblaStatus;
