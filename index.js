/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AppMain from "./src/AppMain";


AppRegistry.registerComponent(appName, () => AppMain);
