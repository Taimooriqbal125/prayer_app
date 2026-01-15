import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, ScrollView, Image } from 'react-native';
import ScreenWrapper from './Layout';

describe('Layout (Advanced Deep Dive)', () => {

    // 1. Functional Test (Beginner)
    // Maqsad: Check karna ke content screen par aa raha hai.
    it('renders children correctly', () => {
        const { getByText } = render(
            <ScreenWrapper>
                <Text>Layout Content</Text>
            </ScreenWrapper>
        );
        expect(getByText('Layout Content')).toBeTruthy();
    });

    // 2. Structural Test (Advanced)
    // Maqsad: Check karna ke internal logic (if/else) sahi kaam kar rahi hai.
    it('logic check: renders ScrollView ONLY when scroll prop is true', () => {
        const { UNSAFE_queryByType, rerender } = render(
            <ScreenWrapper scroll={true}>
                <Text>Scrolling</Text>
            </ScreenWrapper>
        );
        // queryByType advanced hai kyunki ye actual component ki type check karta hai
        expect(UNSAFE_queryByType(ScrollView)).toBeTruthy();

        rerender(
            <ScreenWrapper scroll={false}>
                <Text>Static</Text>
            </ScreenWrapper>
        );
        expect(UNSAFE_queryByType(ScrollView)).toBeNull();
    });

    // 3. Conditional Presence (Advanced)
    // Maqsad: Check karna ke optional components (like Background Image) logic ke mutabiq hide/show ho rahe hain.
    it('logic check: renders Background Image ONLY when showBackground is true', () => {
        const { UNSAFE_queryByType, rerender } = render(
            <ScreenWrapper showBackground={true} />
        );
        expect(UNSAFE_queryByType(Image)).toBeTruthy();

        rerender(<ScreenWrapper showBackground={false} />);
        expect(UNSAFE_queryByType(Image)).toBeNull();
    });
});
