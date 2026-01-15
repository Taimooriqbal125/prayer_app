import React from 'react';
import { render } from '@testing-library/react-native';
import CircularProgress from './CircularProgress';
import { Text } from 'react-native';

describe('CircularProgress Component', () => {

    // Test 1: Check if it renders children elements
    it('renders the children components safely', () => {
        // We pass a simple Text component as a child to see if it appears
        const { getByText } = render(
            <CircularProgress>
                <Text>75%</Text>
            </CircularProgress>
        );

        // If '75%' is found on screen, we know the component rendered its children successfully
        expect(getByText('75%')).toBeTruthy();
    });

    // Beginner Note: Visual components like graphs/circles are hard to test with text.
    // Usually we just check if it doesn't crash (renders successfully).
    it('renders without crashing', () => {
        render(<CircularProgress />);
        // If this line is reached without error, the test passes!
    });
});
