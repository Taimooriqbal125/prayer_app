import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { surahService } from '../../../services/surahService';
// We assume index.json is imported or passed during initialization. 
// However, the spec says "Initialize with index.json data" as an action.

const initialState = {
    surahs: [], // Metadata for all 114 Surahs
    downloadedSurahs: [], // IDs of downloaded non-bundled Surahs (Using Array for serializability)
    downloading: [], // IDs currently being downloaded
    loading: [], // IDs currently being loaded (viewed)
    error: null,
};

// Async Thunk: Initialize Surahs and check offline status
export const initializeSurahsAsync = createAsyncThunk(
    'quran/initializeSurahs',
    async (surahsData, { rejectWithValue }) => {
        try {
            // Check which surahs are already downloaded (in MMKV)
            // We iterate through all Surahs to check status
            const downloadedIds = [];

            // This could be expensive for 114 items if checking one by one synchronously with storage access,
            // but MMKV is fast.
            surahsData.forEach(surah => {
                // If it's NOT bundled check if it's in storage
                // We don't have direct access to localVerses here easily unless we import it or check service.
                // Service handles specific checks. 
                // However, we want to populate 'downloadedSurahs' state.
                const isOffline = surahService.isSurahOfflineAvailable(surah.id);
                // If it's offline available AND NOT bundled (we need to know if it's bundled).
                // The index.json has 'isBundled'.
                if (isOffline && !surah.isBundled) {
                    downloadedIds.push(surah.id);
                }
            });

            return { surahs: surahsData, downloadedIds };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk: Download Surah
export const downloadSurahAsync = createAsyncThunk(
    'quran/downloadSurah',
    async (id, { rejectWithValue }) => {
        try {
            await surahService.downloadSurahForOffline(id);
            return id;
        } catch (error) {
            return rejectWithValue({ id, message: error.message });
        }
    }
);

// Async Thunk: Remove Surah
export const removeSurahAsync = createAsyncThunk(
    'quran/removeSurah',
    async (id, { rejectWithValue }) => {
        try {
            await surahService.removeSurahFromOffline(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const surahSlice = createSlice({
    name: 'quran',
    initialState,
    reducers: {
        initializeSurahs: (state, action) => {
            state.surahs = action.payload;
        },
        setSurahLoading: (state, action) => {
            const { id, isLoading } = action.payload;
            if (isLoading) {
                if (!state.loading.includes(id)) state.loading.push(id);
            } else {
                state.loading = state.loading.filter(loadingId => loadingId !== id);
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        // Helpers for manual updates if needed
        addToDownloaded: (state, action) => {
            const id = action.payload;
            if (!state.downloadedSurahs.includes(id)) {
                state.downloadedSurahs.push(id);
            }
        },
        removeFromDownloaded: (state, action) => {
            const id = action.payload;
            state.downloadedSurahs = state.downloadedSurahs.filter(dId => dId !== id);
        }
    },
    extraReducers: (builder) => {
        builder
            // Initialize
            .addCase(initializeSurahsAsync.fulfilled, (state, action) => {
                state.surahs = action.payload.surahs;
                state.downloadedSurahs = action.payload.downloadedIds;
            })
            // Download
            .addCase(downloadSurahAsync.pending, (state, action) => {
                const id = action.meta.arg;
                if (!state.downloading.includes(id)) state.downloading.push(id);
                state.error = null;
            })
            .addCase(downloadSurahAsync.fulfilled, (state, action) => {
                const id = action.payload;
                state.downloading = state.downloading.filter(dId => dId !== id);
                if (!state.downloadedSurahs.includes(id)) {
                    state.downloadedSurahs.push(id);
                }
            })
            .addCase(downloadSurahAsync.rejected, (state, action) => {
                const { id, message } = action.payload || { id: action.meta.arg, message: action.error.message };
                state.downloading = state.downloading.filter(dId => dId !== id);
                state.error = message;
            })
            // Remove
            .addCase(removeSurahAsync.fulfilled, (state, action) => {
                const id = action.payload;
                state.downloadedSurahs = state.downloadedSurahs.filter(dId => dId !== id);
            });
    }
});

// Selectors
// Selector Functions
export const selectSurahs = (state) => state.quran?.surahs || [];
export const selectDownloadedSurahs = (state) => state.quran?.downloadedSurahs || [];
export const selectDownloading = (state) => state.quran?.downloading || [];
export const selectLoading = (state) => state.quran?.loading || [];

// Memoized Selector
export const selectAllSurahsWithStatus = createSelector(
    [selectSurahs, selectDownloadedSurahs, selectDownloading, selectLoading],
    (surahs, downloadedSurahs, downloading, loading) => {
        return surahs.map(surah => {
            const isBundled = surah.isBundled;
            const isDownloaded = downloadedSurahs.includes(surah.id);
            const isDownloading = downloading.includes(surah.id);
            const isLoading = loading.includes(surah.id);

            return {
                ...surah,
                isBundled,
                isDownloaded,
                isDownloading,
                isLoading,
                canDownload: !isBundled && !isDownloaded && !isDownloading,
                canRemove: isDownloaded
            };
        });
    }
);

export const selectSurahWithStatus = (id) => createSelector(
    [selectAllSurahsWithStatus],
    (allSurahs) => allSurahs.find(s => s.id === id)
);

export const selectDownloadedCount = (state) => {
    return state.quran?.downloadedSurahs?.length || 0;
};

export const { initializeSurahs, setSurahLoading, clearError, addToDownloaded, removeFromDownloaded } = surahSlice.actions;
export default surahSlice.reducer;
