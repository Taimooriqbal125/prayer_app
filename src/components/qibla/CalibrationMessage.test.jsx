import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CalibrationMessage from './CalibrationMessage';

describe('CalibrationMessage', () => {
    describe('Rendering Logic', () => {
        it('should render the calibration message when needsCalibration is true', () => {
            render(<CalibrationMessage needsCalibration={true} />);

            // Verify the icon is displayed
            expect(screen.getByText('⟳')).toBeTruthy();

            // Verify the instruction text is displayed
            expect(screen.getByText('Please move your phone in a figure-8 to calibrate')).toBeTruthy();

            // Verify the demo link is displayed
            expect(screen.getByText('Demo')).toBeTruthy();
        });

        it('should not render anything when needsCalibration is false', () => {
            render(<CalibrationMessage needsCalibration={false} />);

            // Component should return null, so no text should be rendered
            expect(screen.queryByText('⟳')).toBeNull();
            expect(screen.queryByText('Please move your phone in a figure-8 to calibrate')).toBeNull();
            expect(screen.queryByText('Demo')).toBeNull();
        });

        it('should not render anything when needsCalibration is undefined', () => {
            render(<CalibrationMessage needsCalibration={undefined} />);

            // Component should return null when prop is falsy
            expect(screen.queryByText('⟳')).toBeNull();
            expect(screen.queryByText('Demo')).toBeNull();
        });
    });

    describe('Content Verification', () => {
        it('should display correct calibration instructions', () => {
            render(<CalibrationMessage needsCalibration={true} />);

            const instructionText = screen.getByText('Please move your phone in a figure-8 to calibrate');
            expect(instructionText).toBeTruthy();
        });

        it('should display the rotation icon', () => {
            render(<CalibrationMessage needsCalibration={true} />);

            const icon = screen.getByText('⟳');
            expect(icon).toBeTruthy();
        });

        it('should display the demo link text', () => {
            render(<CalibrationMessage needsCalibration={true} />);

            const demoLink = screen.getByText('Demo');
            expect(demoLink).toBeTruthy();
        });
    });

    describe('Conditional Rendering Edge Cases', () => {
        it('should not render with null prop', () => {
            render(<CalibrationMessage needsCalibration={null} />);
            expect(screen.queryByText('⟳')).toBeNull();
            expect(screen.queryByText('Demo')).toBeNull();
        });

        it('should handle missing prop gracefully', () => {
            render(<CalibrationMessage />);
            expect(screen.queryByText('⟳')).toBeNull();
            expect(screen.queryByText('Demo')).toBeNull();
        });
    });
});
