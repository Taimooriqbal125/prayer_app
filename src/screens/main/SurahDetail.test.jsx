import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import SurahDetail from './SurahDetail';
import { surahService } from '../../services/surahService';

// Mock Dependencies
jest.mock('../../components/layout/Layout', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children, testID }) => (
        <View testID={testID || 'screen-wrapper'}>{children}</View>
    );
});

jest.mock('../../components/common/SurahVerseCard', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return ({ arabicText, translation, verseNumber }) => (
        <View testID={`verse-card-${verseNumber}`}>
            <Text>{arabicText}</Text>
            <Text>{translation}</Text>
        </View>
    );
});

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
}));

jest.mock('../../services/surahService', () => ({
    surahService: {
        loadSurah: jest.fn(),
    },
}));

describe('SurahDetail Screen', () => {
    jest.setTimeout(30000); // Higher timeout for this complex screen
    const mockUseRoute = useRoute;
    const mockRouteParams = {
        id: 1,
        name: 'Al-Fatiha',
        transliteration: 'Al-Fatiha',
        translation: 'The Opening',
        type: 'Meccan'
    };

    const mockSurahData = {
        id: 1,
        verses: [
            { id: 1, text: 'Arabic 1', translation: 'Trans 1', transliteration: 'Tr 1' },
            { id: 2, text: 'Arabic 2', translation: 'Trans 2', transliteration: 'Tr 2' },
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRoute.mockReturnValue({ params: mockRouteParams });
    });

    it('should show loading state initially', async () => {
        // Delay promise to inspect loading state
        surahService.loadSurah.mockImplementation(() => new Promise(() => { }));

        render(<SurahDetail />);

        expect(screen.getByText(/Loading Al-Fatiha/)).toBeTruthy();
    });

    it('should render verses after successful fetch', async () => {
        surahService.loadSurah.mockResolvedValue(mockSurahData);

        render(<SurahDetail />);

        // Wait for loading to finish and verses to appear
        await waitFor(() => {
            expect(screen.queryByText(/Loading/)).toBeNull();
        });

        // Check if SurahVerseCards are rendered
        expect(screen.getByTestId('verse-card-1')).toBeTruthy();
        expect(screen.getByTestId('verse-card-2')).toBeTruthy();

        // Check content
        expect(screen.getByText('Arabic 1')).toBeTruthy();
    });

    it('should show error state on fetch failure', async () => {
        surahService.loadSurah.mockRejectedValue(new Error('Network Error'));

        render(<SurahDetail />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to load Surah/)).toBeTruthy();
        });
    });

    it('should handle undefined route params gracefully', () => {
        mockUseRoute.mockReturnValue({ params: undefined });

        // Should not crash, probably just won't trigger fetch or setup
        expect(() => render(<SurahDetail />)).not.toThrow();
    });
});
