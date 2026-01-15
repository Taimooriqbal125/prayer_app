import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Setting from './Setting';

describe('Setting Screen', () => {
    it('should render without crashing', () => {
        expect(() => render(<Setting />)).not.toThrow();
    });

    it('should display "Setting" text', () => {
        render(<Setting />);
        expect(screen.getByText('Setting')).toBeTruthy();
    });
});
