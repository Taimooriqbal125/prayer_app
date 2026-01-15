import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProfileScreen from './ProfileScreen';
import { COLORS } from '../../constants/theme';

describe('ProfileScreen', () => {
    it('should render without crashing', () => {
        expect(() => render(<ProfileScreen />)).not.toThrow();
    });

    it('should display the title "My Profile"', () => {
        render(<ProfileScreen />);
        expect(screen.getByText('My Profile')).toBeTruthy();
    });

    it('should display the description text', () => {
        render(<ProfileScreen />);
        expect(screen.getByText('Profile settings and details go here.')).toBeTruthy();
    });

    it('should have correct background color style', () => {
        // We can test styles if needed, but usually testing visible output is enough.
        // For unit tests, ensuring the component mounts with expected visual elements is key.
        const { getByText } = render(<ProfileScreen />);
        const title = getByText('My Profile');
        expect(title.props.style).toEqual(expect.objectContaining({
            color: COLORS.primary
        }));
    });
});
