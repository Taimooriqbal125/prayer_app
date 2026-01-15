import NetInfo from '@react-native-community/netinfo';
import { storage, removeState } from '../redux/storage'; // Reusing the existing MMKV instance
import localVerses from '../assets/data/localVerses';

const CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/chapters/en';

/**
 * Service to handle Surah data loading with 3-tier strategy.
 * Tier 1: Bundled (localVerses)
 * Tier 2: Cached (MMKV)
 * Tier 3: Network (CDN)
 */
export const surahService = {
    /**
     * Check if a Surah is available offline (Bundled or Cached).
     * @param {number} id - Surah ID
     * @returns {boolean}
     */
    isSurahOfflineAvailable: (id) => {
        // Tier 1: Check bundled
        if (localVerses[id]) {
            return true;
        }
        // Tier 2: Check MMKV cache
        if (storage) {
            return storage.contains(`surah_${id}`);
        }
        return false;
    },

    /**
     * Load Surah data using the 3-tier strategy.
     * @param {number} id - Surah ID
     * @returns {Promise<Object>} Surah data
     */
    loadSurah: async (id) => {
        // Tier 1: Bundled
        if (localVerses[id]) {
            // Return a promise to keep interface consistent
            return Promise.resolve(localVerses[id]);
        }

        // Tier 2: Cached
        if (storage) {
            const cachedData = storage.getString(`surah_${id}`);
            if (cachedData) {
                try {
                    return Promise.resolve(JSON.parse(cachedData));
                } catch (e) {
                    console.error(`Failed to parse cached Surah ${id}`, e);
                    removeState(`surah_${id}`); // clear corrupted data
                }
            }
        }

        // Tier 3: Network (Offline-First check)
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            throw new Error('No internet connection and Surah not available offline.');
        }

        // Fetch from CDN
        try {
            const response = await fetch(`${CDN_BASE_URL}/${id}.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Surah ${id}: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
            // Note: We do NOT auto-cache here as per "NO auto-caching when viewing Surahs" rule.
        } catch (error) {
            throw error;
        }
    },

    /**
     * Download a Surah for offline use (Tier 2).
     * @param {number} id - Surah ID
     * @returns {Promise<void>}
     */
    downloadSurahForOffline: async (id) => {
        // Check if already bundled
        if (localVerses[id]) {
            return; // Already available offline
        }

        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            throw new Error('No internet connection.');
        }

        try {
            const response = await fetch(`${CDN_BASE_URL}/${id}.json`);
            if (!response.ok) {
                throw new Error(`Failed to download Surah ${id}`);
            }
            const data = await response.json();

            // Save to MMKV
            if (storage) {
                storage.set(`surah_${id}`, JSON.stringify(data));
            } else {
                throw new Error('Storage not initialized');
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Remove a Surah from offline cache (Tier 2 only).
     * Cannot remove bundled Surahs.
     * @param {number} id - Surah ID
     * @returns {Promise<void>}
     */
    removeSurahFromOffline: async (id) => {
        // Prevent removing bundled content
        if (localVerses[id]) {
            console.warn(`Cannot remove bundled Surah ${id}`);
            return;
        }

        if (storage) {
            removeState(`surah_${id}`);
        }
    }
};
