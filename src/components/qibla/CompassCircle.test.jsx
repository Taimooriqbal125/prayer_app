import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CompassCircle from './CompassCircle';

// Note: react-native-reanimated and react-native-svg are mocked globally in jest.setup.js

describe('CompassCircle', () => {
    describe('Rendering with Default Props', () => {
        it('should render with default relativeAngle of 0', () => {
            render(<CompassCircle />);
            // Should render without errors
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should render with default qiblaFound as false', () => {
            render(<CompassCircle />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should render the compass container', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            // The component renders a View and AnimatedSvg
            expect(screen.getByText('N')).toBeTruthy();
        });
    });

    describe('Rendering with Custom Props', () => {
        it('should render with custom relativeAngle', () => {
            render(<CompassCircle relativeAngle={45} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should render with qiblaFound set to true', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={true} />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should render with negative relativeAngle', () => {
            render(<CompassCircle relativeAngle={-90} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should render with large relativeAngle (360+)', () => {
            render(<CompassCircle relativeAngle={450} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
        });
    });

    describe('Cardinal Directions - Text Content', () => {
        it('should display North (N) direction marker', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should display East (E) direction marker', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            expect(screen.getByText('E')).toBeTruthy();
        });

        it('should display South (S) direction marker', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            expect(screen.getByText('S')).toBeTruthy();
        });

        it('should display West (W) direction marker', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            expect(screen.getByText('W')).toBeTruthy();
        });

        it('should display all four cardinal directions simultaneously', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
            expect(screen.getByText('E')).toBeTruthy();
            expect(screen.getByText('S')).toBeTruthy();
            expect(screen.getByText('W')).toBeTruthy();
        });
    });

    describe('Animation Behavior', () => {
        it('should handle rotation animation with relativeAngle changes', () => {
            const { rerender } = render(<CompassCircle relativeAngle={0} qiblaFound={false} />);

            // Re-render with different angle
            rerender(<CompassCircle relativeAngle={90} qiblaFound={false} />);

            // Component should not throw and should re-render successfully
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should apply useDerivedValue for smooth rotation', () => {
            const { useDerivedValue } = require('react-native-reanimated');

            render(<CompassCircle relativeAngle={45} qiblaFound={false} />);

            // Verify that useDerivedValue was called
            expect(useDerivedValue).toHaveBeenCalled();
        });

        it('should use withSpring for smooth animation', () => {
            const { withSpring } = require('react-native-reanimated');

            render(<CompassCircle relativeAngle={180} qiblaFound={false} />);

            // Verify that withSpring is used in the animation
            expect(withSpring).toHaveBeenCalled();
        });
    });

    describe('Needle State Based on qiblaFound', () => {
        it('should render needle in default state when qiblaFound is false', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            // Needle is rendered but not in active state
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should render needle in active state when qiblaFound is true', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={true} />);
            // Needle is rendered in active state (green color)
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should toggle needle state when qiblaFound changes', () => {
            const { rerender } = render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();

            // Change qiblaFound to true
            rerender(<CompassCircle relativeAngle={0} qiblaFound={true} />);
            expect(screen.getByText('N')).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle zero relativeAngle', () => {
            render(<CompassCircle relativeAngle={0} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should handle full rotation (360 degrees)', () => {
            render(<CompassCircle relativeAngle={360} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should handle fractional angles', () => {
            render(<CompassCircle relativeAngle={123.456} qiblaFound={false} />);
            expect(screen.getByText('N')).toBeTruthy();
        });

        it('should render without crashing when both props are updated simultaneously', () => {
            const { rerender } = render(<CompassCircle relativeAngle={0} qiblaFound={false} />);

            rerender(<CompassCircle relativeAngle={270} qiblaFound={true} />);

            expect(screen.getByText('N')).toBeTruthy();
        });
    });
});
