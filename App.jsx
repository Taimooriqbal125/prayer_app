import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';

import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs([
    'InteractionManager has been deprecated',
]);

const App = () => {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <RootNavigator />
            </SafeAreaProvider>
        </Provider>
    );
};

export default App;
