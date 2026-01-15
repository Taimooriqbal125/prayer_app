// HomeScreen.js (partial example)
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import PrayerTimeCard from '../../components/common/PrayerTimeCard';
import PrayerCountDown from '../../components/common/PrayerCountDown';
import ScreenWrapper from '../../components/layout/Layout';
import { SIZES } from '../../constants/theme';
import { SunIcon, SunsetIcon, MoonIcon } from '../../components/icons';

import { useDispatch, useSelector } from 'react-redux';
import { calculatePrayerTimes, loadSavedTimes } from '../../redux/features/prayertime/prayerTimeSlice';
import { setLocation, setLocationLoading, setLocationError } from '../../redux/features/location/locationSlice';
import { loadState } from '../../redux/storage';
import { getCurrentLocation } from '../../services/locationService';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState('00:00:00');

    // Redux State
    const { today, status, error } = useSelector((state) => state.prayerTimes);
    const location = useSelector((state) => state.location);

    // Dynamic prayer data with local times
    const prayerList = today ? [
        { id: 1, english: 'Fajr', urdu: 'الفجر', icon: SunIcon, time: today.times.fajr },
        { id: 2, english: 'Dhuhr', urdu: 'الظهر', icon: SunIcon, time: today.times.dhuhr },
        { id: 3, english: 'Asr', urdu: 'العصر', icon: SunIcon, time: today.times.asr },
        { id: 4, english: 'Maghrib', urdu: 'المغرب', icon: SunsetIcon, time: today.times.maghrib },
        { id: 5, english: 'Isha', urdu: 'العشاء', icon: MoonIcon, time: today.times.isha },
    ] : [];

    // Initialize/Refresh Prayer Times
    useEffect(() => {
        const initializePrayerTimes = async () => {
            const savedState = loadState('prayerTimes');
            const todayDate = new Date().toISOString().split('T')[0];

            if (savedState?.today?.date === todayDate &&
                savedState.today.coordinates.latitude === location.latitude &&
                savedState.today.coordinates.longitude === location.longitude) {
                dispatch(loadSavedTimes(savedState));
            } else if (location.latitude && location.longitude) {
                dispatch(calculatePrayerTimes());
            }
        };

        initializePrayerTimes();
    }, [dispatch, location.latitude, location.longitude]);

    // Fetch location if missing
    useEffect(() => {
        if (!location.latitude || !location.longitude) {
            dispatch(setLocationLoading(true));
            getCurrentLocation(
                (loc) => {
                    dispatch(setLocation({
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    }));
                    dispatch(setLocationLoading(false));
                },
                (err) => {
                    dispatch(setLocationError(err));
                    dispatch(setLocationLoading(false));
                }
            );
        }
    }, [dispatch]);

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Calculate next prayer and time remaining
    useEffect(() => {
        if (!prayerList.length) return;

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        let next = prayerList[0];
        let minDiff = Infinity;

        prayerList.forEach(prayer => {
            if (prayer.time && typeof prayer.time === 'string') {
                const trimmedTime = prayer.time.trim();
                const parts = trimmedTime.split(' ');

                if (parts.length < 2) return; // Skip invalid format

                const timeStr = parts[0];
                const ampm = parts[1].toUpperCase();

                const timeParts = timeStr.split(':');
                if (timeParts.length !== 2) return;

                let hours = parseInt(timeParts[0], 10);
                let mins = parseInt(timeParts[1], 10);

                if (isNaN(hours) || isNaN(mins)) return;

                // Convert to 24-hour format
                if (ampm === 'PM' && hours !== 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;

                let prayerMinutes = hours * 60 + mins;
                let diff = prayerMinutes - nowMinutes;

                if (diff <= 0) diff += 24 * 60;

                if (diff < minDiff) {
                    minDiff = diff;
                    next = prayer;
                }
            }
        });

        setNextPrayer(next);

        const hours = Math.floor(minDiff / 60);
        const minutes = minDiff % 60;
        const seconds = 59 - now.getSeconds();
        setTimeRemaining(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );

    }, [currentTime, today]);

    // Header Component (Location & Date)
    const HomeHeader = () => (
        <View style={styles.headerContainer} testID="home-header">
            <View>
                <Text style={styles.locationText}>{location.longitude + ', ' + location.latitude}</Text>
                <Text style={styles.dateText}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.dateText}>3 Jumada Al-Thani 1447</Text>
                <Text style={styles.timeText}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
        </View>
    );

    return (
        <ScreenWrapper scroll={true} header={<HomeHeader />}>
            {/* Next Prayer Countdown */}
            <View style={styles.countdownContainer} testID="countdown-container">
                {nextPrayer ? (
                    <PrayerCountDown
                        nextPrayerName={nextPrayer.english}
                        timeRemaining={timeRemaining}
                    />
                ) : (
                    <View style={styles.loadingPlaceholder}>
                        <Text>Loading Prayer Times...</Text>
                    </View>
                )}
            </View>

            {/* Prayer Time Section */}
            <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Prayer Time</Text>
            </View>

            {/* Prayer Time Cards */}
            <View style={styles.cardsContainer}>
                {status === 'loading' && <Text style={styles.statusText}>Updating times...</Text>}
                {status === 'failed' && <Text style={styles.errorText}>Error: {error}</Text>}

                {prayerList.map((prayer) => (
                    <PrayerTimeCard
                        key={prayer.id}
                        testID={`prayer-card-${prayer.english}`}
                        prayerNameEnglish={prayer.english}
                        prayerNameUrdu={prayer.urdu}
                        time={prayer.time}
                        icon={prayer.icon}
                        isActive={nextPrayer?.id === prayer.id}
                    />
                ))}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 5,
        zIndex: 1,
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0b0a0aff', // White for visibility on background
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#0b0a0aff', // Light color for background
        fontWeight: '500',
    },
    timeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0b0a0aff', // White for background
        marginTop: 4,
    },
    sectionTitleContainer: {
        marginTop: 15,
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    countdownContainer: {
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    cardsContainer: {
        paddingHorizontal: 16,
        gap: 8, // Space between cards
    },
    loadingPlaceholder: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
    },
    statusText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 10,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        marginVertical: 10,
    },
});

export default HomeScreen;