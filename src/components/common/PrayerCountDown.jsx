// NextPrayerCountdown.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

const PrayerCountDown = ({ nextPrayerName, timeRemaining }) => {
  const [animatedValue] = useState(new Animated.Value(0));

  // Animate the container on mount (optional subtle entrance animation)
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, []);

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.leftSection}>
        <Text style={styles.nextPrayerLabel}>Next Prayer : </Text>
        <Text style={styles.nextPrayerName}>{nextPrayerName}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.countdownTime}>{timeRemaining}</Text>
        <View style={styles.timeLabels}>
          <Text style={styles.timeLabelLeft}>Time Remaining</Text>
          <Text style={styles.timeLabelRight}>Left</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#004D40', // Deep green per image
    borderRadius: 20, // More rounded
    paddingVertical: 20, // Generous padding
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: '#A7FFEB', // Light teal/white for label
    fontWeight: '500',
    marginBottom: 4,
  },
  nextPrayerName: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  countdownTime: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'], // Monospaced numbers if supported
    marginBottom: 4,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    minWidth: 100, // Ensure spread
  },
  timeLabelLeft: {
    fontSize: 10,
    color: '#A7FFEB',
    fontWeight: '400',
  },
  timeLabelRight: {
    fontSize: 10,
    color: '#A7FFEB',
    fontWeight: '400',
  },
});

export default PrayerCountDown;