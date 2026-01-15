import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBar, Image } from 'react-native';
import AyatCard from './AyatCard';

// Dummy require to simulate Layout.jsx behavior
const dummyImage = require('../../assets/image.png');
import { SafeAreaView } from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }) => children,
}));

// Beginner Note: Describe blocks group related tests together.
describe('AyatCard Component', () => {

    // Test 1: Check if the Arabic text renders check
    it('renders the correct Arabic text', () => {
        // 1. Render the component
        const { getByText } = render(<AyatCard />);

        // 2. Search for the specific Arabic text
        // We use a regular expression (partial match) because the text might be long
        const arabicText = getByText(/اللَّهُمَّ اغْفِرْ لِي/);

        // 3. Assert that it was found
        expect(arabicText).toBeTruthy();
    });

    // Test 2: Check if the English translation renders
    it('renders the correct English translation', () => {
        const { getByText } = render(<AyatCard />);

        const englishText = getByText(/O Allah, forgive me all my sins/);

        expect(englishText).toBeTruthy();
    });
});
