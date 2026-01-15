import React from 'react';
import { render } from '@testing-library/react-native';
import SurahVerseCard from './SurahVerseCard';

describe('SurahVerseCard Component', () => {

    // Test 1: Default Props
    // This checks if the component uses its default values when no props are passed
    it('renders default surah (An-Nas) information', () => {
        const { getByText } = render(<SurahVerseCard />);

        expect(getByText(/الناس/)).toBeTruthy();        // Default Arabic Name
        expect(getByText(/An-Nas/)).toBeTruthy();       // Default Transliteration
        expect(getByText(/Mankind/)).toBeTruthy();      // Default Meaning
    });

    // Test 2: Custom Props
    // This verifies that we can pass different data to the card
    it('renders custom surah information', () => {
        const { getByText } = render(
            <SurahVerseCard
                surahName="الفلق"
                surahTransliteration="Al-Falaq"
                surahTranslation="The Daybreak"
                verseNumber={3}
            />
        );

        expect(getByText(/الفلق/)).toBeTruthy();
        expect(getByText(/Al-Falaq/)).toBeTruthy();
        expect(getByText(/The Daybreak/)).toBeTruthy();
        expect(getByText(/آية 3/)).toBeTruthy();
    });
});
