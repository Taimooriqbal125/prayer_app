// Mock Reanimated
jest.mock('react-native-reanimated', () => {
    const React = require('react');
    const View = require('react-native').View;
    const Text = require('react-native').Text;

    return {
        default: {
            createAnimatedComponent: (component) => component,
            View,
            Text,
        },
        useSharedValue: jest.fn(() => ({ value: 0 })),
        useAnimatedProps: jest.fn(() => ({})),
        useAnimatedStyle: jest.fn(() => ({})),
        useDerivedValue: jest.fn((callback) => ({ value: callback() })),
        withTiming: jest.fn(),
        withSpring: jest.fn((value) => value),
        interpolate: jest.fn(),
        createAnimatedComponent: (component) => component,
    };
});

// Mock SVG
jest.mock('react-native-svg', () => {
    const React = require('react');
    const View = require('react-native').View;
    const Text = require('react-native').Text;
    return {
        __esModule: true,
        default: View,
        Svg: View,
        Circle: View,
        Line: View,
        Path: View,
        Text: Text,
    };
});

// Mock MMKV
jest.mock('react-native-mmkv', () => {
    const mockStorage = {
        getString: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
        getAllKeys: jest.fn().mockReturnValue([]),
        clearAll: jest.fn(),
    };
    return {
        MMKV: jest.fn().mockImplementation(() => mockStorage),
        createMMKV: jest.fn().mockReturnValue(mockStorage),
    };
});

// Global timeout - some navigation/async tests take longer in CI/Windows
jest.setTimeout(10000);

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
    addEventListener: jest.fn(),
    useNetInfo: jest.fn(() => ({ isConnected: true })),
}));

// Mock Permissions
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

// Mock Geolocation
jest.mock('react-native-geolocation-service', () => ({
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    stopObserving: jest.fn(),
}));

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native').View;
    return {
        Swipeable: View,
        DrawerLayout: View,
        State: {},
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        ToolbarAndroid: View,
        ViewPagerAndroid: View,
        DrawerLayoutAndroid: View,
        WebView: View,
        NativeViewGestureHandler: View,
        TapGestureHandler: View,
        FlingGestureHandler: View,
        ForceTouchGestureHandler: View,
        LongPressGestureHandler: View,
        PanGestureHandler: View,
        PinchGestureHandler: View,
        RotationGestureHandler: View,
        RawButton: View,
        BaseButton: View,
        RectButton: View,
        BorderlessButton: View,
        FlatList: View,
        gestureHandlerRootHOC: jest.fn(() => View),
        Directions: {},
        GestureHandlerRootView: ({ children }) => children,
    };
});

// Mock Safe Area Context
jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    const Context = React.createContext(inset);
    return {
        SafeAreaProvider: ({ children }) => children,
        SafeAreaView: ({ children }) => children,
        useSafeAreaInsets: jest.fn(() => inset),
        SafeAreaConsumer: Context, // Provide the context object itself
        SafeAreaContext: Context,
        initialWindowMetrics: {
            frame: { x: 0, y: 0, width: 0, height: 0 },
            insets: inset,
        },
    };
});

// Mock Sensors
jest.mock('react-native-sensors', () => ({
    magnetometer: {
        subscribe: jest.fn(),
    },
    SensorTypes: {
        magnetometer: 'magnetometer',
    },
    setUpdateIntervalForType: jest.fn(),
}));

// Mock Screens
jest.mock('react-native-screens', () => ({
    enableScreens: jest.fn(),
    ScreenContainer: ({ children }) => children,
    Screen: ({ children }) => children,
    NativeScreen: ({ children }) => children,
    NativeScreenContainer: ({ children }) => children,
    ScreenStack: ({ children }) => children,
    ScreenStackHeaderConfig: ({ children }) => children,
    ScreenStackHeaderSubview: ({ children }) => children,
    SearchBar: ({ children }) => children,
}));
