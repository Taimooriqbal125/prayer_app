import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalibrationMessage = ({ needsCalibration }) => {
    if (!needsCalibration) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>⟳</Text>
            <Text style={styles.text}>
                Please move your phone in a figure-8 to calibrate
            </Text>
            <Text style={styles.demo}>Demo</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    icon: {
        fontSize: 24,
        marginBottom: 8,
        color: '#DAA520',
    },
    text: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 6,
    },
    demo: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default CalibrationMessage;
