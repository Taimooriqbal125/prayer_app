import React from 'react';
import { render, screen } from '@testing-library/react-native';
import QiblaStatus from './QiblaStatus';

describe('QiblaStatus', () => {
    describe('Rendering with Default/Null Values', () => {
        it('should render with null qiblaAngle', () => {
            render(<QiblaStatus qiblaAngle={null} isFound={false} relativeAngle={0} />);

            // Should display '--°' when qiblaAngle is null
            expect(screen.getByText('--°')).toBeTruthy();
        });

        it('should render "Finding Qibla..." when isFound is false', () => {
            render(<QiblaStatus qiblaAngle={null} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('Finding Qibla...')).toBeTruthy();
        });

        it('should render with relativeAngle of 0', () => {
            render(<QiblaStatus qiblaAngle={null} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('--°')).toBeTruthy();
            expect(screen.getByText('Finding Qibla...')).toBeTruthy();
        });
    });

    describe('Rendering with Valid Qibla Angle', () => {
        it('should display qibla angle with 2 decimal places', () => {
            render(<QiblaStatus qiblaAngle={45.6789} isFound={false} relativeAngle={10} />);

            expect(screen.getByText('45.68°')).toBeTruthy();
        });

        it('should display exact angle when it has no decimals', () => {
            render(<QiblaStatus qiblaAngle={90} isFound={false} relativeAngle={5} />);

            expect(screen.getByText('90.00°')).toBeTruthy();
        });

        it('should handle zero qibla angle', () => {
            render(<QiblaStatus qiblaAngle={0} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('0.00°')).toBeTruthy();
        });

        it('should handle negative qibla angle', () => {
            render(<QiblaStatus qiblaAngle={-45.12} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('-45.12°')).toBeTruthy();
        });

        it('should handle angles greater than 360', () => {
            render(<QiblaStatus qiblaAngle={450.555} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('450.56°')).toBeTruthy();
        });
    });

    describe('Qibla Found Status Badge', () => {
        it('should display "Finding Qibla..." when isFound is false', () => {
            render(<QiblaStatus qiblaAngle={120} isFound={false} relativeAngle={10} />);

            expect(screen.getByText('Finding Qibla...')).toBeTruthy();
        });

        it('should display "✓ Qibla Found" when isFound is true', () => {
            render(<QiblaStatus qiblaAngle={120} isFound={true} relativeAngle={5} />);

            expect(screen.getByText('✓ Qibla Found')).toBeTruthy();
        });

        it('should toggle status text when isFound changes', () => {
            const { rerender } = render(
                <QiblaStatus qiblaAngle={120} isFound={false} relativeAngle={10} />
            );

            expect(screen.getByText('Finding Qibla...')).toBeTruthy();

            // Update to found
            rerender(<QiblaStatus qiblaAngle={120} isFound={true} relativeAngle={5} />);

            expect(screen.getByText('✓ Qibla Found')).toBeTruthy();
        });
    });

    describe('Debug Mode - __DEV__ Behavior', () => {
        const originalDEV = global.__DEV__;

        afterEach(() => {
            global.__DEV__ = originalDEV;
        });

        it('should display debug info when __DEV__ is true', () => {
            global.__DEV__ = true;

            render(<QiblaStatus qiblaAngle={120} isFound={false} relativeAngle={15.789} />);

            // Debug text should show relative angle with 1 decimal place
            expect(screen.getByText('Relative: 15.8°')).toBeTruthy();
        });

        it('should not display debug info when __DEV__ is false', () => {
            global.__DEV__ = false;

            render(<QiblaStatus qiblaAngle={120} isFound={false} relativeAngle={15.789} />);

            // Debug text should NOT be present
            expect(screen.queryByText(/Relative:/)).toBeNull();
        });

        it('should format relative angle to 1 decimal place in debug mode', () => {
            global.__DEV__ = true;

            render(<QiblaStatus qiblaAngle={120} isFound={false} relativeAngle={123.456789} />);

            expect(screen.getByText('Relative: 123.5°')).toBeTruthy();
        });

        it('should handle null relativeAngle in debug mode', () => {
            global.__DEV__ = true;

            render(<QiblaStatus qiblaAngle={120} isFound={false} relativeAngle={null} />);

            // Should display with null handling
            expect(() => screen.getByText(/Relative:/)).not.toThrow();
        });
    });

    describe('Combined State Scenarios', () => {
        it('should display both angle and "Qibla Found" when isFound is true', () => {
            render(<QiblaStatus qiblaAngle={285.50} isFound={true} relativeAngle={2} />);

            expect(screen.getByText('285.50°')).toBeTruthy();
            expect(screen.getByText('✓ Qibla Found')).toBeTruthy();
        });

        it('should display "--°" and "Finding Qibla..." when angle is null and not found', () => {
            render(<QiblaStatus qiblaAngle={null} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('--°')).toBeTruthy();
            expect(screen.getByText('Finding Qibla...')).toBeTruthy();
        });

        it('should display angle even when Qibla is found', () => {
            render(<QiblaStatus qiblaAngle={180.25} isFound={true} relativeAngle={1} />);

            expect(screen.getByText('180.25°')).toBeTruthy();
            expect(screen.getByText('✓ Qibla Found')).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle null qiblaAngle explicitly', () => {
            render(<QiblaStatus qiblaAngle={null} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('--°')).toBeTruthy();
        });

        it('should handle very small decimal angles', () => {
            render(<QiblaStatus qiblaAngle={0.001} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('0.00°')).toBeTruthy();
        });

        it('should handle very large angles', () => {
            render(<QiblaStatus qiblaAngle={9999.999} isFound={false} relativeAngle={0} />);

            expect(screen.getByText('10000.00°')).toBeTruthy();
        });

        it('should re-render correctly when all props change', () => {
            const { rerender } = render(
                <QiblaStatus qiblaAngle={null} isFound={false} relativeAngle={0} />
            );

            expect(screen.getByText('--°')).toBeTruthy();
            expect(screen.getByText('Finding Qibla...')).toBeTruthy();

            rerender(<QiblaStatus qiblaAngle={45} isFound={true} relativeAngle={2} />);

            expect(screen.getByText('45.00°')).toBeTruthy();
            expect(screen.getByText('✓ Qibla Found')).toBeTruthy();
        });
    });
});
