// PrayerTimeCard.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { SunIcon, SunsetIcon, MoonIcon } from '../icons';

const PrayerTimeCard = ({
    prayerNameEnglish,
    prayerNameUrdu,
    time,
    icon: IconComponent,
    isActive = false,
    onPress,
    containerStyle,
    testID,
}) => {
    const [animatedValue] = useState(new Animated.Value(0));

    // Animate the green highlight when active
    useEffect(() => {
        if (isActive) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [isActive]);

    // Interpolate animated value to control the width of the green highlight
    const highlightWidth = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8], // Width of the green highlight bar
    });

    // Determine background color based on active state
    const backgroundColor = isActive ? '#B49A67' : '#FFFFFF';
    const textColor = isActive ? '#FFFFFF' : '#000000';
    const timeColor = isActive ? '#FFFFFF' : '#000000';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor }, containerStyle]}
            onPress={onPress}
            activeOpacity={0.7}
            testID={testID}
        >
            {/* Green Highlight Bar (only visible when active) */}
            {isActive && (
                <Animated.View
                    style={[
                        styles.highlightBar,
                        {
                            width: highlightWidth,
                            backgroundColor: '#2ECC71',
                        },
                    ]}
                />
            )}

            {/* Icon Section */}
            <View style={styles.iconContainer}>
                {IconComponent && <IconComponent size={24} color={textColor} />}
            </View>

            {/* Text Section */}
            <View style={styles.textContainer}>
                <Text style={[styles.prayerNameEnglish, { color: textColor }]}>
                    {prayerNameEnglish}
                </Text>
                <Text style={[styles.prayerNameUrdu, { color: textColor }]}>
                    {prayerNameUrdu}
                </Text>
            </View>

            {/* Time Section */}
            <View style={styles.timeContainer}>
                <Text style={[styles.timeText, { color: timeColor }]}>
                    {time}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// Demo data for the five prayers
export const PRAYER_DATA = [
    {
        id: 1,
        english: 'Fajr',
        urdu: 'لفجر',
        icon: SunIcon,
        time: '04:59 AM',
    },
    {
        id: 2,
        english: 'Dhuhr',
        urdu: 'الظهر',
        icon: SunIcon,
        time: '11:46 AM',
    },
    {
        id: 3,
        english: 'Asr',
        urdu: 'العصر', // Fixed Urdu spelling if needed, using generic sunny icon for Asr too
        icon: SunIcon,
        time: '03:30 PM',
    },
    {
        id: 4,
        english: 'Maghrib',
        urdu: 'المغرب',
        icon: SunsetIcon,
        time: '05:45 PM',
    },
    {
        id: 5,
        english: 'Isha',
        urdu: 'العشاء',
        icon: MoonIcon,
        time: '07:15 PM',
    },
];

// Styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginVertical: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    highlightBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    iconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    prayerNameEnglish: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    prayerNameUrdu: {
        fontSize: 14,
        fontWeight: '400',
        opacity: 0.8,
    },
    timeContainer: {
        marginLeft: 12,
    },
    timeText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PrayerTimeCard;