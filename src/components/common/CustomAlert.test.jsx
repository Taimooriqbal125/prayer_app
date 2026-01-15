import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomAlert from './CustomAlert';

describe('CustomAlert Component', () => {

    // Test 1: Check if Title and Message appear
    it('displays the title and message when visible', () => {
        const { getByText } = render(
            <CustomAlert
                visible={true}
                title="Alert Check"
                message="This is a test message"
            />
        );

        // Assert that the text we passed is actually found on the screen
        expect(getByText('Alert Check')).toBeTruthy();
        expect(getByText('This is a test message')).toBeTruthy();
    });

    // Test 2: Check the "Continue" button action
    it('calls the onClose function when Continue is pressed', () => {
        // A "Mock" function allows us to track if it was called
        const mockOnClose = jest.fn();

        const { getByText } = render(
            <CustomAlert
                visible={true}
                title="Title"
                message="Message"
                onClose={mockOnClose}
            />
        );

        // Simulate a user pressing the 'Continue' button
        const continueButton = getByText('Continue');
        fireEvent.press(continueButton);

        // Verify our mock function was called exactly once
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    // Test 3: Check the "Cancel" button action
    it('calls the onCancel function when Cancel is pressed', () => {
        const mockOnCancel = jest.fn();

        const { getByText } = render(
            <CustomAlert
                visible={true}
                title="Title"
                message="Message"
                showCancel={true}
                onCancel={mockOnCancel}
            />
        );

        // Simulate pressing 'Cancel'
        const cancelButton = getByText('Cancel');
        fireEvent.press(cancelButton);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});
