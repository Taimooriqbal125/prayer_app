
// Mock react-native-mmkv
const mockSet = jest.fn();
const mockGetString = jest.fn();
const mockDelete = jest.fn();
const mockRemove = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('react-native-mmkv', () => {
    return {
        createMMKV: jest.fn(() => ({
            set: mockSet,
            getString: mockGetString,
            delete: mockDelete,
            remove: mockRemove,
            removeItem: mockRemoveItem,
        })),
    };
});

describe('storage utility', () => {
    let storageUtils;
    const KEY = 'test_key';
    const DATA = { foo: 'bar' };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset modules to ensure storage.js re-evaluates and picks up the mock
        jest.resetModules();
        storageUtils = require('./storage');
    });

    describe('saveState', () => {
        it('should save data to MMKV correctly', () => {
            storageUtils.saveState(KEY, DATA);
            expect(mockSet).toHaveBeenCalledWith(KEY, JSON.stringify(DATA));
        });

        it('should handle errors gracefully', () => {
            mockSet.mockImplementationOnce(() => {
                throw new Error('Save failed');
            });
            expect(() => storageUtils.saveState(KEY, DATA)).not.toThrow();
        });
    });

    describe('loadState', () => {
        it('should load and parse data correctly', () => {
            mockGetString.mockReturnValue(JSON.stringify(DATA));
            const result = storageUtils.loadState(KEY);
            expect(result).toEqual(DATA);
            expect(mockGetString).toHaveBeenCalledWith(KEY);
        });

        it('should return undefined if key does not exist', () => {
            mockGetString.mockReturnValue(undefined);
            const result = storageUtils.loadState(KEY);
            expect(result).toBeUndefined();
        });

        it('should return undefined if parsing fails', () => {
            mockGetString.mockReturnValue('invalid json');
            const result = storageUtils.loadState(KEY);
            expect(result).toBeUndefined();
        });
    });

    describe('removeState', () => {
        it('should remove data using available delete method', () => {
            storageUtils.removeState(KEY);
            expect(mockDelete).toHaveBeenCalledWith(KEY);
        });
    });
});
