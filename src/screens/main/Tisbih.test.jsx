import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Tisbih from './Tisbih';

// Mock Dependencies
jest.mock('../../components/layout/Layout', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children, testID }) => (
        <View testID={testID || 'screen-wrapper'}>{children}</View>
    );
});

jest.mock('../../components/common/CircularProgress', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children }) => <View testID="circular-progress">{children}</View>;
});

// Mock Actions
jest.mock('../../redux/features/tasbih/tasbihSlice', () => ({
    increment: jest.fn(() => ({ type: 'tasbih/increment' })),
    reset: jest.fn(() => ({ type: 'tasbih/reset' })),
    nextPhrase: jest.fn(() => ({ type: 'tasbih/nextPhrase' })),
    prevPhrase: jest.fn(() => ({ type: 'tasbih/prevPhrase' })),
    setLimit: jest.fn(() => ({ type: 'tasbih/setLimit' })),
}));

// Actions (needed for expectation checks)
import { increment, reset, nextPhrase, prevPhrase, setLimit } from '../../redux/features/tasbih/tasbihSlice';

const mockStore = configureStore([]);

describe('Tisbih Screen', () => {
    let store;

    const initialState = {
        tasbih: {
            count: 10,
            limit: 33,
            currentPhraseIndex: 0,
            totalCount: 100,
            phrases: [
                { text: 'SubhanAllah', translation: 'Glory to God' },
                { text: 'Alhamdulillah', translation: 'Praise be to God' },
            ]
        }
    };

    beforeEach(() => {
        store = mockStore(initialState);
        jest.clearAllMocks();
    });

    const renderTisbih = () => {
        return render(
            <Provider store={store}>
                <Tisbih />
            </Provider>
        );
    };

    it('should render current count and limit', () => {
        renderTisbih();
        expect(screen.getByText('10')).toBeTruthy();
        expect(screen.getByText('10/33')).toBeTruthy();
    });

    it('should render current phrase text', () => {
        renderTisbih();
        expect(screen.getByText('SubhanAllah')).toBeTruthy();
        expect(screen.getByText('Glory to God')).toBeTruthy();
    });

    it('should dispatch increment on main tap', () => {
        renderTisbih();

        fireEvent.press(screen.getByTestId('increment-btn'));
        expect(increment).toHaveBeenCalled();
    });

    it('should dispatch reset on reset button tap', () => {
        renderTisbih();

        fireEvent.press(screen.getByTestId('reset-btn'));
        expect(reset).toHaveBeenCalled();
    });

    it('should navigate phrases', () => {
        renderTisbih();

        fireEvent.press(screen.getByTestId('next-phrase-btn'));
        expect(nextPhrase).toHaveBeenCalled();

        fireEvent.press(screen.getByTestId('prev-phrase-btn'));
        expect(prevPhrase).toHaveBeenCalled();
    });

    it('should open limit modal and change limit', () => {
        renderTisbih();

        // Open modal
        fireEvent.press(screen.getByTestId('limit-select-btn'));

        // Select new limit (e.g., 100)
        expect(screen.getByText('Select Target')).toBeTruthy();

        fireEvent.press(screen.getByTestId('limit-option-100'));
        expect(setLimit).toHaveBeenCalledWith(100);
    });
});
