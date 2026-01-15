import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            <Text style={styles.text}>Profile settings and details go here.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: SIZES.medium,
        color: COLORS.primary,
    },
    text: {
        fontSize: SIZES.font,
    },
});

export default ProfileScreen;
