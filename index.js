/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';

import FBMessaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {defaultConfig, Engage} from './src/screens/HomeScreen';
import {Mapp} from './node_modules/react-native-mapp-plugin';

/**
 * Mapp.engage() must be called here, before of a FBMessaging().setBackgroundMessageHanlder()
 * otherwise exception is thrown in native Java code (Appoxee.instance is not initialized!!!)
 */
Engage(defaultConfig);

FBMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
  Mapp.setRemoteMessage(remoteMessage);
  Mapp.isPushFromMapp(remoteMessage).then((p) => {
    console.log('Is push from MAPP', p);
  });
  //   AsyncStorage.getItem('@config')
  //     .then((json) => {
  //       const config = json !== null ? JSON.parse(json) : defaultConfig;

  //       Engage(config);

  //       Mapp.setRemoteMessage(remoteMessage);
  //       Mapp.isPushFromMapp(remoteMessage).then((p) => {
  //         console.log('Is push from MAPP', p);
  //       });
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
});

AppRegistry.registerComponent(appName, () => App);
