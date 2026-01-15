import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Surat from './Surat';
import { COLORS } from '../../constants/theme';

// Mock Dependencies
jest.mock('../../components/layout/Layout', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children, testID }) => (
        <View testID={testID || 'screen-wrapper'}>{children}</View>
    );
});

jest.mock('../../components/common/AyatCard', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return () => <View><Text>Ayat of the Day</Text></View>;
});

jest.mock('../../components/common/SuratCard', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return ({ englishName, onPress, onDownload, onRemove, isDownloaded }) => (
        <View testID={`surah-card-container-${englishName}`}>
            <TouchableOpacity testID={`surah-card-${englishName}`} onPress={onPress}>
                <Text>{englishName}</Text>
                {isDownloaded && <Text>Downloaded</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={onDownload} testID={`download-btn-${englishName}`}>
                <Text>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRemove} testID={`remove-btn-${englishName}`}>
                <Text>Remove</Text>
            </TouchableOpacity>
        </View>
    );
});

jest.mock('../../components/common/CustomAlert', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return ({ visible, title, message, onClose, onCancel, showCancel, confirmText, cancelText }) => {
        if (!visible) return null;
        return (
            <View testID="custom-alert">
                <Text>{title}</Text>
                <Text>{message}</Text>
                <TouchableOpacity onPress={onClose} testID="alert-confirm-btn">
                    <Text>{confirmText}</Text>
                </TouchableOpacity>
                {showCancel && (
                    <TouchableOpacity onPress={onCancel} testID="alert-cancel-btn">
                        <Text>{cancelText}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
});

// Mock Redux Actions
jest.mock('../../redux/features/quran/surahSlice', () => ({
    initializeSurahsAsync: jest.fn(() => ({ type: 'surah/init' })),
    downloadSurahAsync: jest.fn(() => ({ type: 'surah/download' })),
    removeSurahAsync: jest.fn(() => ({ type: 'surah/remove' })),
    clearError: jest.fn(() => ({ type: 'surah/clearError' })),
    selectAllSurahsWithStatus: (state) => state.quran.surahs, // Selector mock
}));

const mockStore = configureStore([]);
const mockNavigation = { navigate: jest.fn() };

// Mock navigation hook
jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => mockNavigation,
    };
});

describe('Surat Screen', () => {
    let store;

    const mockSurahs = [
        { id: 1, name: 'Al-Fatiha', translation: 'The Opening', transliteration: 'Al-Fatiha', type: 'Meccan', isDownloaded: true, isBundled: false },
        { id: 2, name: 'Al-Baqarah', translation: 'The Cow', transliteration: 'Al-Baqarah', type: 'Medinan', isDownloaded: false, isBundled: false },
    ];

    const initialState = {
        quran: {
            surahs: mockSurahs,
            loading: false,
            error: null,
        },
    };

    beforeEach(() => {
        store = mockStore(initialState);
        jest.clearAllMocks();
    });

    const renderSurat = () => {
        return render(
            <Provider store={store}>
                <Surat />
            </Provider>
        );
    };

    it('should render correct number of surahs', () => {
        renderSurat();
        // Uses FlatList, but we mocked SuratCard
        expect(screen.getByText('Al-Fatiha')).toBeTruthy();
        expect(screen.getByText('Al-Baqarah')).toBeTruthy();
    });

    it('should navigate to details on surah press', () => {
        renderSurat();

        fireEvent.press(screen.getByTestId('surah-card-Al-Fatiha'));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('SurahVerse', {
            id: 1,
            name: 'Al-Fatiha',
            transliteration: 'Al-Fatiha',
            translation: 'The Opening',
            type: 'Meccan'
        });
    });

    it('should toggle filter to show offline only', () => {
        renderSurat();

        // Find filter button by text content
        const filterBtn = screen.getByText('Show All Surahs');
        fireEvent.press(filterBtn);

        // Should update text
        expect(screen.getByText('Showing Offline Only')).toBeTruthy();

        // Should only show downloaded surah (Al-Fatiha) and hide Al-Baqarah
        // Note: In our mocked SuratCard, we don't hide items automatically unless parent re-renders list.
        // ScreenWrapper re-renders. 
        // Let's verify visibility logic.
        expect(screen.queryByText('Al-Fatiha')).toBeTruthy();
        expect(screen.queryByText('Al-Baqarah')).toBeNull(); // Should be filtered out
    });

    it('should trigger download action', () => {
        renderSurat();

        fireEvent.press(screen.getByTestId('download-btn-Al-Baqarah'));

        const actions = store.getActions();
        // We expect downloadSurahAsync action
        expect(actions).toContainEqual({ type: 'surah/download' });
    });

    it('should show alert on error', () => {
        store = mockStore({
            quran: {
                surahs: [],
                error: 'Download Failed',
            }
        });

        renderSurat();

        expect(screen.getByText('Error')).toBeTruthy();
        expect(screen.getByText('Download Failed')).toBeTruthy();
    });

    it('should clear error when alert closed', () => {
        store = mockStore({
            quran: {
                surahs: [],
                error: 'Some Error',
            }
        });

        renderSurat();

        // Close alert
        fireEvent.press(screen.getByTestId('alert-confirm-btn')); // "OK" button

        const actions = store.getActions();
        expect(actions).toContainEqual({ type: 'surah/clearError' });
    });

    it('should show remove alert and trigger removal on confirm', () => {
        renderSurat();

        // Trigger remove alert
        fireEvent.press(screen.getByTestId('remove-btn-Al-Fatiha'));

        // Alert should be visible
        expect(screen.getByText('Remove Surah?')).toBeTruthy();
        expect(screen.getByText(/Are you sure you want to remove Al-Fatiha/)).toBeTruthy();

        // Confirm removal
        fireEvent.press(screen.getByTestId('alert-confirm-btn'));

        const actions = store.getActions();
        expect(actions).toContainEqual({ type: 'surah/remove' });
    });

    it('should show remove alert and close it on cancel', () => {
        renderSurat();

        fireEvent.press(screen.getByTestId('remove-btn-Al-Fatiha'));

        // Cancel
        fireEvent.press(screen.getByTestId('alert-cancel-btn'));

        // Alert should be gone
        expect(screen.queryByTestId('custom-alert')).toBeNull();
    });
});
