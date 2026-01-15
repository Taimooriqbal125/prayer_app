import surahReducer, {
    initializeSurahsAsync,
    downloadSurahAsync,
    removeSurahAsync,
    setSurahLoading,
    clearError,
    initializeSurahs,
    addToDownloaded,
    removeFromDownloaded,
    selectAllSurahsWithStatus
} from './surahSlice';
import { configureStore } from '@reduxjs/toolkit';
import { surahService } from '../../../services/surahService';

// Mock dependencies
jest.mock('../../../services/surahService', () => ({
    surahService: {
        isSurahOfflineAvailable: jest.fn(),
        downloadSurahForOffline: jest.fn(),
        removeSurahFromOffline: jest.fn(),
    },
}));

describe('surahSlice', () => {
    const initialState = {
        surahs: [],
        downloadedSurahs: [],
        downloading: [],
        loading: [],
        error: null,
    };

    const mockSurahsData = [
        { id: 1, name: 'Al-Fatiha', isBundled: false },
        { id: 2, name: 'Al-Baqarah', isBundled: false },
        { id: 3, name: 'Al-Imran', isBundled: true },
    ];

    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                quran: surahReducer,
            },
        });
        jest.clearAllMocks();
    });

    it('should return initial state', () => {
        expect(surahReducer(undefined, {})).toEqual(initialState);
    });

    describe('Reducers', () => {
        it('should handle setSurahLoading', () => {
            const state = surahReducer(initialState, setSurahLoading({ id: 1, isLoading: true }));
            expect(state.loading).toContain(1);

            const state2 = surahReducer(state, setSurahLoading({ id: 1, isLoading: false }));
            expect(state2.loading).not.toContain(1);
        });

        it('should handle initialization manually', () => {
            const state = surahReducer(initialState, initializeSurahs(mockSurahsData));
            expect(state.surahs).toEqual(mockSurahsData);
        });
    });

    describe('Async Thunks', () => {
        describe('initializeSurahsAsync', () => {
            it('should initialize and check offline status successfully', async () => {
                // Mock service: Surah 1 is offline, Surah 2 is not
                surahService.isSurahOfflineAvailable.mockImplementation((id) => id === 1);

                await store.dispatch(initializeSurahsAsync(mockSurahsData));

                const state = store.getState().quran;
                expect(state.surahs).toHaveLength(3);
                // Surah 1 is offline and not bundled -> should be in downloadedSurahs
                // Surah 3 is bundled -> offline check might return true/false but bundled ones usually don't need "downloaded" mark if implied, 
                // but the reducer logic specifically checks `!surah.isBundled`.
                expect(state.downloadedSurahs).toContain(1);
                expect(state.downloadedSurahs).not.toContain(2);
            });
        });

        describe('downloadSurahAsync', () => {
            it('should handle successful download', async () => {
                surahService.downloadSurahForOffline.mockResolvedValue(true);

                // Dispatch
                const promise = store.dispatch(downloadSurahAsync(1));

                // Check pending state (manual check of state during async not easily possible without middleware or multiple asserts, 
                // but we can check final state)
                await promise;

                const state = store.getState().quran;
                expect(state.downloadedSurahs).toContain(1);
                expect(state.downloading).not.toContain(1);
                expect(state.error).toBeNull();
            });

            it('should handle download failure', async () => {
                const errorMsg = 'Network Error';
                surahService.downloadSurahForOffline.mockRejectedValue(new Error(errorMsg));

                await store.dispatch(downloadSurahAsync(1));

                const state = store.getState().quran;
                expect(state.downloadedSurahs).not.toContain(1);
                expect(state.error).toEqual(errorMsg);
            });
        });

        describe('removeSurahAsync', () => {
            it('should remove surah from downloaded list', async () => {
                // Setup initial state with downloaded surah
                await store.dispatch(addToDownloaded(1));

                surahService.removeSurahFromOffline.mockResolvedValue(true);

                await store.dispatch(removeSurahAsync(1));

                const state = store.getState().quran;
                expect(state.downloadedSurahs).not.toContain(1);
            });
        });
    });

    describe('Selectors', () => {
        it('should correctly select all surahs with status', () => {
            const state = {
                quran: {
                    surahs: mockSurahsData, // 1, 2, 3
                    downloadedSurahs: [1],
                    downloading: [2],
                    loading: [],
                    error: null
                }
            };

            const result = selectAllSurahsWithStatus(state);

            // Surah 1: Downloaded
            expect(result[0].id).toBe(1);
            expect(result[0].isDownloaded).toBe(true);
            expect(result[0].canDownload).toBe(false);

            // Surah 2: Downloading
            expect(result[1].id).toBe(2);
            expect(result[1].isDownloading).toBe(true);
            expect(result[1].canDownload).toBe(false);

            // Surah 3: Bundled
            expect(result[2].id).toBe(3);
            expect(result[2].isBundled).toBe(true);
            expect(result[2].canDownload).toBe(false);
        });
    });
});
