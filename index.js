/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';

// Suppress the deprecated InteractionManager warning coming from internal libraries
LogBox.ignoreLogs(['InteractionManager has been deprecated']);
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
