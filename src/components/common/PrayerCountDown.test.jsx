import React from 'react';
import { render } from '@testing-library/react-native';
import PrayerCountDown from './PrayerCountDown';

describe('PrayerCountDown Component', () => {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // Test 1: Verify Props are being displayed
    it('displays the next prayer name and time remaining', () => {
        // Render with specific props
        const { getByText } = render(
            <PrayerCountDown
                nextPrayerName="Fajr"
                timeRemaining="02:30:00"
            />
        );

        // Check if the component displays the props we passed along with static labels
        expect(getByText('Fajr')).toBeTruthy();       // Dynamic prop
        expect(getByText('02:30:00')).toBeTruthy();   // Dynamic prop
        expect(getByText('Next Prayer : ')).toBeTruthy(); // Static label
        expect(getByText('Time Remaining')).toBeTruthy(); // Static label
    });
});
