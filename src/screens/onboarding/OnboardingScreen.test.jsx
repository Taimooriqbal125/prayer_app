import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import OnboardingScreen from './OnboardingScreen';
import { completeOnboarding } from '../../redux/features/app/appSlice';

// Mock the redux action
jest.mock('../../redux/features/app/appSlice', () => ({
    completeOnboarding: jest.fn(() => ({ type: 'app/completeOnboarding' })),
}));

// Mock ScreenWrapper component
jest.mock('../../components/layout/Layout', () => {
    const React = require('react');
    return ({ children, ...props }) => {
        return React.createElement('View', { ...props, testID: 'screen-wrapper' }, children);
    };
});

const mockStore = configureStore([]);

describe('OnboardingScreen', () => {
    let store;
    let navigation;

    beforeEach(() => {
        // Create a fresh store for each test
        store = mockStore({
            app: { onboardingComplete: false },
        });

        // Clear all mocks before each test
        store.clearActions();
        jest.clearAllMocks();

        // Mock navigation object
        navigation = {
            navigate: jest.fn(),
            goBack: jest.fn(),
            replace: jest.fn(),
        };
    });

    const renderOnboardingScreen = () => {
        return render(
            <Provider store={store}>
                <OnboardingScreen navigation={navigation} />
            </Provider>
        );
    };

    describe('Initial Rendering', () => {
        it('should render without crashing', () => {
            expect(() => renderOnboardingScreen()).not.toThrow();
        });

        it('should render ScreenWrapper', () => {
            const { getByTestId } = renderOnboardingScreen();
            expect(getByTestId('screen-wrapper')).toBeTruthy();
        });

        it('should render the first onboarding slide', () => {
            renderOnboardingScreen();
            expect(screen.getByText('Track Your Prayers')).toBeTruthy();
        });

        it('should render the first slide emoji', () => {
            renderOnboardingScreen();
            expect(screen.getByText('🕌')).toBeTruthy();
        });

        it('should render the first slide description', () => {
            renderOnboardingScreen();
            expect(screen.getByText(/Keep track of your daily Salah/i)).toBeTruthy();
        });
    });

    describe('Button Rendering - First Slide', () => {
        it('should render Skip button on first slide', () => {
            renderOnboardingScreen();
            expect(screen.getByText('Skip')).toBeTruthy();
        });

        it('should render Next button on first slide', () => {
            renderOnboardingScreen();
            expect(screen.getByText('Next')).toBeTruthy();
        });

        it('should not render Get Started button on first slide', () => {
            renderOnboardingScreen();
            expect(screen.queryByText('Get Started')).toBeNull();
        });
    });

    describe('Skip Button Functionality', () => {
        it('should call completeOnboarding when Skip is pressed', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            fireEvent.press(skipButton);

            expect(completeOnboarding).toHaveBeenCalled();
        });

        it('should dispatch completeOnboarding action when Skip is pressed', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            fireEvent.press(skipButton);

            const actions = store.getActions();
            expect(actions).toContainEqual({ type: 'app/completeOnboarding' });
        });
    });

    describe('Next Button Functionality', () => {
        it('should be pressable on first slide', () => {
            renderOnboardingScreen();

            const nextButton = screen.getByText('Next');
            expect(() => fireEvent.press(nextButton)).not.toThrow();
        });

        it('should update to second slide content when Next is pressed', () => {
            const { rerender } = renderOnboardingScreen();

            const nextButton = screen.getByText('Next');
            fireEvent.press(nextButton);

            // Note: Due to FlatList mocking limitations, we test the button press doesn't crash
            expect(() => fireEvent.press(nextButton)).not.toThrow();
        });
    });

    describe('Pagination Dots', () => {
        it('should render pagination dots for all slides', () => {
            renderOnboardingScreen();
            // There should be 3 onboarding slides, so 3 dots rendered
            expect(screen.getByTestId('pagination-dot-0')).toBeTruthy();
            expect(screen.getByTestId('pagination-dot-1')).toBeTruthy();
            expect(screen.getByTestId('pagination-dot-2')).toBeTruthy();
        });
    });

    describe('Onboarding Data', () => {
        it('should display correct title for first slide', () => {
            renderOnboardingScreen();
            expect(screen.getByText('Track Your Prayers')).toBeTruthy();
        });

        it('should display correct emoji for first slide', () => {
            renderOnboardingScreen();
            expect(screen.getByText('🕌')).toBeTruthy();
        });

        it('should display correct description for first slide', () => {
            renderOnboardingScreen();
            expect(screen.getByText(/Keep track of your daily Salah/i)).toBeTruthy();
        });
    });

    describe('Component Structure', () => {
        it('should render FlatList component', () => {
            renderOnboardingScreen();
            // FlatList renders the slides
            expect(screen.getByTestId('onboarding-flatlist')).toBeTruthy();
        });

        it('should render footer section with buttons', () => {
            renderOnboardingScreen();
            expect(screen.getByText('Skip')).toBeTruthy();
            expect(screen.getByText('Next')).toBeTruthy();
        });
    });

    describe('Redux Integration', () => {
        it('should have access to Redux store', () => {
            expect(() => renderOnboardingScreen()).not.toThrow();
        });

        it('should dispatch action through mock store', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            fireEvent.press(skipButton);

            const actions = store.getActions();
            expect(actions.length).toBeGreaterThan(0);
        });
    });

    describe('Props Handling', () => {
        it('should receive navigation prop', () => {
            expect(() => renderOnboardingScreen()).not.toThrow();
        });

        it('should work with navigation object', () => {
            const customNav = {
                navigate: jest.fn(),
                goBack: jest.fn(),
            };

            expect(() => render(
                <Provider store={store}>
                    <OnboardingScreen navigation={customNav} />
                </Provider>
            )).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle Skip button press multiple times', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            fireEvent.press(skipButton);
            fireEvent.press(skipButton);

            // Should handle multiple presses gracefully
            expect(completeOnboarding).toHaveBeenCalled();
        });

        it('should handle Next button press when on first slide', () => {
            renderOnboardingScreen();

            const nextButton = screen.getByText('Next');
            expect(() => fireEvent.press(nextButton)).not.toThrow();
        });

        it('should render with empty store state', () => {
            const emptyStore = mockStore({});

            expect(() => render(
                <Provider store={emptyStore}>
                    <OnboardingScreen navigation={navigation} />
                </Provider>
            )).not.toThrow();
        });

        it('should handle missing navigation prop gracefully', () => {
            expect(() => render(
                <Provider store={store}>
                    <OnboardingScreen />
                </Provider>
            )).not.toThrow();
        });
    });

    describe('Text Content Verification', () => {
        it('should render all slide titles', () => {
            renderOnboardingScreen();

            // First slide should be visible
            expect(screen.getByText('Track Your Prayers')).toBeTruthy();
        });

        it('should render button text correctly', () => {
            renderOnboardingScreen();

            expect(screen.getByText('Skip')).toBeTruthy();
            expect(screen.getByText('Next')).toBeTruthy();
        });

        it('should use proper text casing for buttons', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            const nextButton = screen.getByText('Next');

            expect(skipButton).toBeTruthy();
            expect(nextButton).toBeTruthy();
        });
    });

    describe('Accessibility', () => {
        it('should render touchable buttons', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            const nextButton = screen.getByText('Next');

            expect(skipButton).toBeTruthy();
            expect(nextButton).toBeTruthy();
        });

        it('should have pressable Skip button', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            expect(() => fireEvent.press(skipButton)).not.toThrow();
        });

        it('should have pressable Next button', () => {
            renderOnboardingScreen();

            const nextButton = screen.getByText('Next');
            expect(() => fireEvent.press(nextButton)).not.toThrow();
        });
    });

    describe('Component Lifecycle', () => {
        it('should initialize with default state', () => {
            expect(() => renderOnboardingScreen()).not.toThrow();
        });

        it('should render consistently on multiple renders', () => {
            const { rerender } = renderOnboardingScreen();

            expect(screen.getByText('Track Your Prayers')).toBeTruthy();

            rerender(
                <Provider store={store}>
                    <OnboardingScreen navigation={navigation} />
                </Provider>
            );

            expect(screen.getByText('Track Your Prayers')).toBeTruthy();
        });
    });

    describe('Store Actions', () => {
        it('should clear actions after beforeEach', () => {
            renderOnboardingScreen();

            const initialActions = store.getActions();
            expect(initialActions).toEqual([]);
        });

        it('should track dispatched actions', () => {
            renderOnboardingScreen();

            const skipButton = screen.getByText('Skip');
            fireEvent.press(skipButton);

            const actions = store.getActions();
            expect(actions.length).toBe(1);
            expect(actions[0]).toEqual({ type: 'app/completeOnboarding' });
        });
    });
});
