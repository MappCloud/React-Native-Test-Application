/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import {URL} from 'react-native-url-polyfill';

import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';

import {Mapp} from 'react-native-mapp-plugin';
import {MappButton, MappInputText} from './src/components';
import FBMessaging, {firebase} from '@react-native-firebase/messaging';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {version as appVersion} from './app.json';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
/**
 * Created by Aleksandar Marinkovic on 5/16/19.
 * Copyright (c) 2019 MAPP.
 */
type Props = {};

/**
 * Handler method for receiving firebase push messages
 * Same method is used as a delegate for a setBackgroundMessageHandler() and onMessage()
 */
const handleFirebasePushMessage = async (remoteMessage) => {
  console.log(remoteMessage);
  Mapp.setRemoteMessage(remoteMessage);
  Mapp.isPushFromMapp(remoteMessage).then((p) => {
    console.log('Is push from MAPP', p);
  });
};

/**
 * Mapp.engage() must be called here, before of a FBMessaging().setBackgroundMessageHanlder()
 * otherwise exception is thrown in native Java code (Appoxee.instance is not initialized!!!)
 */
//Mapp.engage('17c12566d0e614.60317593', '785651527831', 'L3', '206793', '5963');
// Mapp.engage(
//   '17c07c2d350614.65753469',
//   '785651527831',
//   'TEST_55',
//   '300012',
//   '55',
// );

//  static engage(sdkKey: string, googleProjectId: string, server: string, appID: string, tenantID: string)
Mapp.engage(
  '181dcae619262c.50504750',
  '785651527831',
  'EMC_US',
  '310491',
  '60211',
);


/**
 * setBackgroundMessageHandler must be called outside of application class as soon as posible
 * so that application properly receive firebase messages in quit state.
 */
FBMessaging().setBackgroundMessageHandler(handleFirebasePushMessage);

export default class App extends Component<Props> {
  state = {
    aliasState: '',
    removeAttribute: '',
    addAttribute: '',
    getAttribute: '',
    removeTags: '',
    setTags: '',
    defaultError: false,
    defaultErrorMessage: '',
    firebaseToken: '',
  };

  constructor(props) {
    super(props);
    FBMessaging().onMessage(handleFirebasePushMessage);
    this.getToken();
    this.addDeeplink();
  }

  handleTextChange = (type) => (text) => {
    this.setState({[type]: text});
  };

  render() {
    const {state} = this;
    return (
      <SafeAreaView>
        <ScrollView>
          <ImageBackground
            style={{width: '100%'}}
            source={require('./src/img/promo_image.png')}
            resizeMode={'contain'}
            backgroundColor={'black'}>
            <View style={styles.container}>
              <Text style={styles.welcome}>
                Welcome to React Native Mapp plugin! v.{appVersion}
              </Text>
              <MappInputText
                maxLength={255}
                label="Set Device Alias"
                autoCorrect={false}
                autoCapitalize="none"
                value={state.aliasState}
                onChangeText={this.handleTextChange('aliasState')}
                error={state.defaultError}
                errorMessage={state.defaultErrorMessage}
              />
              <MappButton text={'Set Device Alias'} onPress={this.setAlias} />
              <MappButton text={'Get Device Alias'} onPress={this.getAlias} />
              <MappButton
                text={'Device Information'}
                onPress={this.getDevice}
              />
              <MappButton
                text={'Is Push Enabled'}
                onPress={this.isPushEnabled}
              />
              <MappButton text={'Opt in'} onPress={this.optIn} />
              <MappButton text={'Opt out'} onPress={this.optOut} />
              <MappButton text={'Start Geo'} onPress={this.startGeo} />
              <MappButton text={'Stop Geo'} onPress={this.stopGeo} />
              <MappButton
                text={'Fetch inbox messages'}
                onPress={this.fetchInbox}
              />
              <MappButton
                text={'In App: App Open'}
                onPress={this.appOpenEvent}
              />
              <MappButton
                text={'In App: App Feedback'}
                onPress={this.appFeedbackEvent}
              />
              <MappButton
                text={'In App: App Discount'}
                onPress={this.appDiscountEvent}
              />
              <MappButton
                text={'In App: App Promo'}
                onPress={this.appPromoEvent}
              />
              <MappButton text={'Fcm Token'} onPress={this.showToken} />

              <Text style={styles.labelText}>FCM Token</Text>
              <Text style={styles.normalText} onPress={this.copyToClipboard}>
                {state.firebaseToken}
              </Text>

              <MappButton
                text={'Fetch Multiple Messages'}
                onPress={this.fetchMultipleMessages}
              />
              <MappButton text={'Get Tags'} onPress={this.getTags} />

              <MappInputText
                maxLength={255}
                label="Set Tags"
                autoCorrect={false}
                autoCapitalize="none"
                value={state.setTags}
                onChangeText={this.handleTextChange('setTags')}
                error={state.defaultError}
                errorMessage={state.defaultErrorMessage}
              />
              <MappButton text={'Set Tags'} onPress={this.setTagsEvent} />

              <MappInputText
                maxLength={255}
                label="Remove Tags"
                autoCorrect={false}
                autoCapitalize="none"
                value={state.removeTags}
                onChangeText={this.handleTextChange('removeTags')}
                error={state.defaultError}
                errorMessage={state.defaultErrorMessage}
              />
              <MappButton text={'Remove Tag'} onPress={this.removeTagEvent} />
              <MappInputText
                maxLength={255}
                label="Set Attribute"
                autoCorrect={false}
                autoCapitalize="none"
                value={state.addAttribute}
                onChangeText={this.handleTextChange('addAttribute')}
                error={state.defaultError}
                errorMessage={state.defaultErrorMessage}
              />
              <MappButton
                text={'Set Attribute'}
                onPress={this.setAttributeEvent}
              />
              <MappInputText
                maxLength={255}
                label="Get Attribute"
                autoCorrect={false}
                autoCapitalize="none"
                value={state.getAttribute}
                onChangeText={this.handleTextChange('getAttribute')}
                error={state.defaultError}
                errorMessage={state.defaultErrorMessage}
              />
              <MappButton
                text={'Get Attribute'}
                onPress={this.getAttributeEvent}
              />
              <MappInputText
                maxLength={255}
                label="Remove Attribute"
                autoCorrect={false}
                autoCapitalize="none"
                value={state.removeAttribute}
                onChangeText={this.handleTextChange('removeAttribute')}
                error={state.defaultError}
                errorMessage={state.defaultErrorMessage}
              />
              <MappButton
                text={'Remove Attribute'}
                onPress={this.removeAttributeEvent}
              />
              <MappButton
                text={'Remove Badge Number'}
                onPress={this.removeBadgeNumberEvent}
              />
              <MappButton
                text={'Lock Orientation'}
                onPress={this.lockOrientationEvent}
              />
              <MappButton text={'Engage'} onPress={this.engageEvent} />
              <MappButton text={'Engage2'} onPress={this.engageEvent2} />
              <MappButton text={'Deep links'} onPress={this.addDeeplink} />
              <MappButton
                text={'Push listener'}
                onPress={this.addPushListener}
              />
              <MappButton text={'Log out'} onPress={this.logOut} />
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }

  getToken = () => {
    const token = async () => {
      const token = await FBMessaging().getToken();
      this.setState((state) => ({
        ...state,
        firebaseToken: token,
      }));
      console.log(token);
      Mapp.setToken(token);
    };
    token();
  };

  showToken = () => {
    Alert.alert('Token', this.state.firebaseToken);
  };

  copyToClipboard = () => {
    Clipboard.setString(this.state.firebaseToken);
    Toast.show('Token is copied to Clipboard!');
  };

  setAlias = () => {
    Mapp.setAlias(this.state.aliasState);
  };

  getAlias = () => {
    Mapp.getAlias().then((data) => {
      console.log(data);
      Alert.alert("Alias",data);
    });
  };

  isPushEnabled = () => {
    Mapp.isPushEnabled().then((data) => {
      console.log(data);
      Alert.alert("Push enabled",data.toString());
    });
  };

  getDevice = () => {
    Mapp.getDeviceInfo().then((data) => {
      Alert.alert("Device info",JSON.stringify(data));
    });
  };

  optIn = () => {
    Mapp.setPushEnabled(true);
  };

  optOut = () => {
    Mapp.setPushEnabled(false);
  };

  requestPermissions = () => {
    Mapp.requestGeofenceLocationPermissions()
      .then((result) => {})
      .catch((error) => {});
  };

  startGeo = () => {
    Mapp.startGeofencing()
      .then((result) => {
        console.log(result);
        Alert.alert('Geofencing start', result);
      })
      .catch((code, error) => {
        console.log(code, error);
      });
  };

  stopGeo = () => {
    Mapp.stopGeofencing()
      .then((result) => {
        console.log(result);
        Alert.alert('Geofencing stop', result);
      })
      .catch((code, error) => {
        console.log(code, error);
      });
  };

  fetchInbox = () => {
    Mapp.fetchInboxMessage().then((data) => {
      if (Platform.OS == 'ios') {
        Mapp.addInboxMessagesListener((messages) => {
          Alert.alert("Inbox message",JSON.stringify(messages));
        });
      } else {
        Alert.alert('Inbox message', JSON.stringify(data));
      }
    });
  };
  appOpenEvent = () => {
    Mapp.triggerInApp('app_open');
  };
  appFeedbackEvent = () => {
    Mapp.triggerInApp('app_feedback');
  };
  appDiscountEvent = () => {
    Mapp.triggerInApp('app_discount');
  };
  appPromoEvent = () => {
    Mapp.triggerInApp('app_promo');
  };
  fetchMultipleMessages = () => {
    Mapp.fetchInboxMessage().then((data) => {
      if (Platform.OS == 'ios') {
        Mapp.addInboxMessagesListener((messages) => {
          Alert.alert(JSON.stringify(messages));
        });
      } else {
        Alert.alert(JSON.stringify(data));
      }
    });
  };

  getTags = () => {
    Mapp.getTags().then((data) => {
      Alert.alert(JSON.stringify(data));
    });
  };

  setTagsEvent = () => {
    Mapp.addTag(this.state.setTags);
  };

  removeTagEvent = () => {
    Mapp.removeTag(this.state.removeTags);
  };
  setAttributeEvent = () => {
    Mapp.setAttributeString('test', this.state.addAttribute);
  };
  getAttributeEvent = () => {
    Mapp.getAttributeStringValue('test').then((data) => {
      Alert.alert(data);
    });
  };
  removeAttributeEvent = () => {
    Mapp.removeAttribute('test');
  };
  removeBadgeNumberEvent = () => {
    Mapp.removeBadgeNumber();
  };
  lockOrientationEvent = () => {
    // Mapp.engage("5c59a56fd39ce9.45048743","1028993954364","https://jamie-test.shortest-route.com","263176","55")
  };

  engageEvent = () => {
    Mapp.engage(
      '5fd76d903c2247.21400126',
      '1028993954364',
      'TEST',
      '264115',
      '33',
    );
  };

  engageEvent2 = () => {
    navigateMyApp();
  };

  addDeeplink = () => {
    Mapp.addDeepLinkingListener((notification) => {
      let action = notification.action;
      let url1 = notification.url;
      console.log(notification);
      const uri = new URL(url1);
      const link = url1;
      const message_id = action;
      //Alert.alert(JSON.stringify(url1));
      this.props.navigation.navigate('Home', {
        myLink: link,
        message_id: message_id,
      });
    });
  };

  addPushListener = () => {
    Mapp.addPushListener((notification) => {
      console.log(JSON.stringify(notification));
      Alert.alert(JSON.stringify(notification));
    });
  };

  logOut = () => {
    Mapp.logOut(true);
  };
}

function navigateMyApp(): PureComponent {
  // const navigation = useNavigation();
  // navigation.navigate('Home', {name: 'Jane'})
}

const styles = StyleSheet.create({
  labelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#FF0000',
    padding: 10,
  },

  normalText: {
    color: '#FFFFFF',
    fontWeight: 'normal',
    fontSize: 14,
    backgroundColor: '#FF0000',
    padding: 10,
  },

  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
    //   alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
