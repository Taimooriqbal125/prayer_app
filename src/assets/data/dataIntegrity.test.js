import indexData from './index.json';
import fs from 'fs';
import path from 'path';

describe('Quran Data Integrity', () => {

    describe('index.json validation', () => {
        it('should be an array', () => {
            expect(Array.isArray(indexData)).toBe(true);
        });

        it('should contain 114 surahs', () => {
            expect(indexData.length).toBe(114);
        });

        it('should have required fields for each surah', () => {
            indexData.forEach(surah => {
                expect(surah).toMatchObject({
                    id: expect.any(Number),
                    name: expect.any(String),
                    transliteration: expect.any(String),
                    type: expect.any(String),
                    total_verses: expect.any(Number),
                    link: expect.any(String),
                    isBundled: expect.any(Boolean)
                });
            });
        });

        it('should have unique IDs from 1 to 114', () => {
            const ids = indexData.map(s => s.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(114);
            expect(Math.min(...ids)).toBe(1);
            expect(Math.max(...ids)).toBe(114);
        });
    });

    describe('Bundled Surah Files validation', () => {
        const bundledSurahs = indexData.filter(s => s.isBundled);

        it('should have at least some bundled surahs (smoke test)', () => {
            expect(bundledSurahs.length).toBeGreaterThan(0);
        });

        bundledSurahs.forEach(surah => {
            it(`should validate ${surah.id}.json (${surah.transliteration})`, () => {
                const filePath = path.resolve(__dirname, `${surah.id}.json`);

                // Check if file exists
                expect(fs.existsSync(filePath)).toBe(true);

                // Read and parse file
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // Validate structure
                expect(content).toMatchObject({
                    id: surah.id,
                    name: surah.name,
                    transliteration: surah.transliteration,
                    total_verses: surah.total_verses,
                    verses: expect.any(Array)
                });

                // Validate verses count
                expect(content.verses.length).toBe(surah.total_verses);

                // Validate each verse
                content.verses.forEach(verse => {
                    expect(verse).toMatchObject({
                        id: expect.any(Number),
                        text: expect.any(String),
                        translation: expect.any(String),
                        transliteration: expect.any(String)
                    });
                });
            });
        });
    });

    describe('File Consistency', () => {
        it('should only have JSON files for surahs marked as bundled', () => {
            const files = fs.readdirSync(__dirname);
            const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
            const bundledIds = indexData.filter(s => s.isBundled).map(s => `${s.id}.json`);

            // Every JSON file (except index) must be in bundledIds
            jsonFiles.forEach(file => {
                expect(bundledIds).toContain(file);
            });

            // Every bundledId must have a file
            bundledIds.forEach(file => {
                expect(jsonFiles).toContain(file);
            });
        });
    });
});
