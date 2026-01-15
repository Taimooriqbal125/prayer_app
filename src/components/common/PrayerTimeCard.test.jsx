import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PrayerTimeCard from './PrayerTimeCard';
import { View } from 'react-native';

// Mock Icon component for testing since we pass it as a prop or rely on import
const MockIcon = (props) => <View {...props} testID="mock-icon" />;

describe('PrayerTimeCard Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // Test 1: Check Content
    it('renders the prayer name and time', () => {
        const { getByText } = render(
            <PrayerTimeCard
                prayerNameEnglish="Maghrib"
                prayerNameUrdu="المغرب"
                time="05:45 PM"
                icon={MockIcon}
            />
        );

        expect(getByText('Maghrib')).toBeTruthy();
        expect(getByText('المغرب')).toBeTruthy();
        expect(getByText('05:45 PM')).toBeTruthy();
    });

    // Test 2: Click Interaction
    it('responds to being pressed', () => {
        const mockOnPress = jest.fn();

        const { getByText } = render(
            <PrayerTimeCard
                prayerNameEnglish="Maghrib"
                time="05:45 PM"
                onPress={mockOnPress}
            />
        );

        // Find the element by text and press it
        fireEvent.press(getByText('Maghrib'));

        // Verify the press worked
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
});
