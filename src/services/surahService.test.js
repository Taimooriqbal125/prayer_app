// Mocks must be declared before imports to ensure hoisting (if using ES imports)
// But since we are having issues, we will use require inside the test.


// Mock storage
jest.mock('../redux/storage', () => ({
    storage: {
        getString: jest.fn(),
        set: jest.fn(),
        contains: jest.fn(),
    },
    removeState: jest.fn(),
}));

// Mock localVerses
// If the source does "import localVerses", it expects a default export.
const mockLocalVerses = {
    1: { id: 1, name: 'Al-Fatiha', verses: [] },
    2: { id: 2, name: 'Al-Baqara', verses: [] }
};

jest.mock('../assets/data/localVerses', () => ({
    __esModule: true,
    default: mockLocalVerses
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

describe('surahService', () => {
    let surahService;
    let mockStorage;
    let mockRemoveState;
    let mockNetInfoFetch;

    beforeEach(() => {
        jest.resetModules(); // Reset cache to ensure fresh import of surahService with mocks
        jest.clearAllMocks();

        // Get handles to the mocks SO WE CAN ASSERT ON THEM
        const storageModule = require('../redux/storage');
        mockStorage = storageModule.storage;
        mockRemoveState = storageModule.removeState;

        mockNetInfoFetch = require('@react-native-community/netinfo').fetch;

        // Re-require service under test
        surahService = require('./surahService').surahService;
    });

    describe('isSurahOfflineAvailable', () => {
        it('should return true if surah is bundled (Tier 1)', () => {
            // ID 1 is in mockLocalVerses
            expect(surahService.isSurahOfflineAvailable(1)).toBe(true);
            expect(mockStorage.contains).not.toHaveBeenCalled();
        });

        it('should return true if surah is cached (Tier 2)', () => {
            // ID 2 in cache
            mockStorage.contains.mockReturnValue(true);
            expect(surahService.isSurahOfflineAvailable(2)).toBe(true);
        });

        it('should return false if neither bundled nor cached', () => {
            mockStorage.contains.mockReturnValue(false);
            expect(surahService.isSurahOfflineAvailable(3)).toBe(false);
        });
    });

    describe('loadSurah', () => {
        it('should load from bundled data (Tier 1)', async () => {
            const data = await surahService.loadSurah(1);
            expect(data).toEqual(mockLocalVerses[1]);
            expect(mockStorage.getString).not.toHaveBeenCalled();
        });

        it('should load from storage cache (Tier 2)', async () => {
            const ID = 99;
            const cachedData = { id: ID, name: 'Cache Surah' };
            mockStorage.getString.mockReturnValue(JSON.stringify(cachedData));

            const data = await surahService.loadSurah(ID);
            expect(data).toEqual(cachedData);
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should handle corrupted cache by removing it', async () => {
            // Use ID 3 which is NOT bundled, otherwise loadSurah returns bundled content early
            // Wait, loadSurah checks localVerses[id] first.
            // If we want to test cache corruption, we must use an ID that is NOT in localVerses.
            // ID 1 and 2 ARE in localVerses.
            // So loadSurah(2) returns localVerses[2] immediately!
            // It never reaches cache check.

            // LET'S USE ID 99 for non-bundled tests.
            const ID = 99;

            mockStorage.getString.mockReturnValue('invalid json');
            mockNetInfoFetch.mockResolvedValue({ isConnected: true });
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ id: ID, fetched: true })
            });

            const data = await surahService.loadSurah(ID);

            expect(mockRemoveState).toHaveBeenCalledWith(`surah_${ID}`);
            expect(data.fetched).toBe(true);
        });

        it('should load from network (Tier 3)', async () => {
            // Use ID 99
            const ID = 99;
            mockStorage.getString.mockReturnValue(null); // Not cached
            mockNetInfoFetch.mockResolvedValue({ isConnected: true });

            const netData = { id: ID, name: 'Al-Imran' };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => netData
            });

            const data = await surahService.loadSurah(ID);
            expect(data).toEqual(netData);
        });

        it('should throw error if offline and not cached', async () => {
            const ID = 99;
            mockStorage.getString.mockReturnValue(null);
            mockNetInfoFetch.mockResolvedValue({ isConnected: false });

            await expect(surahService.loadSurah(ID)).rejects.toThrow('No internet connection');
        });

        it('should throw error if fetch fails', async () => {
            const ID = 99;
            mockStorage.getString.mockReturnValue(null);
            mockNetInfoFetch.mockResolvedValue({ isConnected: true });
            global.fetch.mockResolvedValue({
                ok: false,
                statusText: 'Not Found'
            });

            await expect(surahService.loadSurah(ID)).rejects.toThrow(`Failed to fetch Surah ${ID}`);
        });
    });

    describe('downloadSurahForOffline', () => {
        it('should do nothing if surah is bundled', async () => {
            await surahService.downloadSurahForOffline(1);
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should download and save to storage', async () => {
            const ID = 99;
            mockNetInfoFetch.mockResolvedValue({ isConnected: true });
            const netData = { id: ID };
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => netData
            });

            await surahService.downloadSurahForOffline(ID);

            expect(mockStorage.set).toHaveBeenCalledWith(`surah_${ID}`, JSON.stringify(netData));
        });

        it('should throw if offline', async () => {
            const ID = 99;
            mockNetInfoFetch.mockResolvedValue({ isConnected: false });
            await expect(surahService.downloadSurahForOffline(ID)).rejects.toThrow('No internet connection');
        });
    });

    describe('removeSurahFromOffline', () => {
        it('should call removeState', async () => {
            const ID = 99;
            await surahService.removeSurahFromOffline(ID);
            expect(mockRemoveState).toHaveBeenCalledWith(`surah_${ID}`);
        });

        it('should not remove bundled surah', async () => {
            await surahService.removeSurahFromOffline(1);
            expect(mockRemoveState).not.toHaveBeenCalled();
        });
    });
});
