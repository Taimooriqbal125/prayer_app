import { createMMKV } from 'react-native-mmkv';

// Diagnostic logs removed for production

// Add a safety check for MMKV initialization
let storage = null;
try {
    if (typeof createMMKV !== 'undefined') {
        storage = createMMKV();
    } else {
        console.error('createMMKV is undefined! Check if react-native-mmkv is properly installed.');
    }
} catch (error) {
    console.error('Failed to initialize MMKV:', error);
}

// Memory fallback for when the native module is missing (e.g. during dev before rebuild)
const memoryStorage = new Map();

export { storage };

/**
 * Helper to save a specific slice of state to MMKV
 */
export const saveState = (key, state) => {
    try {
        const serializedState = JSON.stringify(state);
        if (storage) {
            storage.set(key, serializedState);
        } else {
            memoryStorage.set(key, serializedState);
        }
    } catch (err) {
        console.error('Could not save state', err);
    }
};

/**
 * Helper to load a specific slice of state from MMKV
 */
export const loadState = (key) => {
    try {
        let serializedState;
        if (storage) {
            serializedState = storage.getString(key);
        } else {
            serializedState = memoryStorage.get(key);
        }

        if (serializedState === undefined || serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};
/**
 * Helper to remove a specific slice of state from MMKV
 */
export const removeState = (key) => {
    try {
        if (storage) {
            // Check for delete method (standard)
            if (typeof storage.delete === 'function') {
                storage.delete(key);
            }
            // Check for remove method (legacy/alternative)
            else if (typeof storage.remove === 'function') {
                storage.remove(key);
            }
            // Fallback for removeItem
            else if (typeof storage.removeItem === 'function') {
                storage.removeItem(key);
            }
        } else {
            memoryStorage.delete(key);
        }
    } catch (err) {
        console.error('Could not remove state', err);
    }
};
