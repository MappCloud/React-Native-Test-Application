/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import {URL} from 'react-native-url-polyfill';

import React, {Component, PureComponent, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Alert,
  Button,
} from 'react-native';

import {Mapp} from 'react-native-mapp-plugin';
import {MappButton, MappInputText} from '../components';
import FBMessaging from '@react-native-firebase/messaging';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

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

/**
 * Handler method for receiving firebase push messages
 * Same method is used as a delegate for a setBackgroundMessageHandler() and onMessage()
 */
export const handleFirebasePushMessage = async (remoteMessage) => {
  console.log(remoteMessage);
  Mapp.setRemoteMessage(remoteMessage);
  Mapp.isPushFromMapp(remoteMessage).then((p) => {
    console.log('Is push from MAPP', p);
  });
};

export const Engage = (config) => {
  Mapp.engage(
    config.sdkKey,
    config.googleProjectId,
    config.server,
    config.appId,
    config.tenatId,
  );
};

export const defaultConfig = {
  sdkKey: '17c12566d0e614.60317593',
  googleProjectId: '785651527831',
  server: 'L3',
  appId: '206793',
  tenatId: '5963',
};

const HomeScreen = ({navigation, route}) => {
  const defaultState = {
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

  const [state, setState] = useState(defaultState);

  useEffect(() => {
    FBMessaging().onMessage(handleFirebasePushMessage);
    getToken();
  }, []);

  useEffect(() => {
    if (route.params) {
      const config = route.params.config;
      if (config !== null) {
        console.log('HomeScreen', 'Mapp.engage()', config);
        Engage(config);
      }
    }
  }, [route.params]);

  const handleTextChange = (type) => (text) => {
    setState({[type]: text});
  };

  const getToken = () => {
    const token = async () => {
      const token = await FBMessaging().getToken();
      setState((state) => ({
        ...state,
        firebaseToken: token,
      }));
      console.log(token);
      Mapp.setToken(token);
    };
    token();
  };

  const showToken = () => {
    Alert.alert('Token', state.firebaseToken);
  };

  const copyToClipboard = () => {
    Clipboard.setString(state.firebaseToken);
    Toast.show('Token is copied to Clipboard!');
  };

  const setAlias = () => {
    Mapp.setAlias(state.aliasState);
  };

  const getAlias = () => {
    Mapp.getAlias().then((data) => {
      console.log(data);
      Alert.alert(data);
    });
  };

  const isPushEnabled = () => {
    Mapp.isPushEnabled().then((data) => {
      console.log(data);
      Alert.alert(data.toString());
    });
  };

  const getDevice = () => {
    Mapp.getDeviceInfo().then((data) => {
      Alert.alert(JSON.stringify(data));
    });
  };

  const optIn = () => {
    Mapp.setPushEnabled(true);
  };

  const optOut = () => {
    Mapp.setPushEnabled(false);
  };
  const startGeo = () => {
    Mapp.startGeoFencing();
  };
  const stopGeo = () => {
    Mapp.stopGeoFencing();
  };
  const fetchInbox = () => {
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
  const appOpenEvent = () => {
    Mapp.triggerInApp('app_open');
  };
  const appFeedbackEvent = () => {
    Mapp.triggerInApp('app_feedback');
  };
  const appDiscountEvent = () => {
    Mapp.triggerInApp('app_discount');
  };
  const appPromoEvent = () => {
    Mapp.triggerInApp('app_promo');
  };
  const fetchMultipleMessages = () => {
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

  const getTags = () => {
    Mapp.getTags().then((data) => {
      Alert.alert(JSON.stringify(data));
    });
  };

  const setTagsEvent = () => {
    Mapp.addTag(state.setTags);
  };

  const removeTagEvent = () => {
    Mapp.removeTag(state.removeTags);
  };
  const setAttributeEvent = () => {
    Mapp.setAttributeString('test', state.addAttribute);
  };

  const getAttributeEvent = () => {
    Mapp.getAttributeStringValue('test').then((data) => {
      Alert.alert(data);
    });
  };

  const removeAttributeEvent = () => {
    Mapp.removeAttribute('test');
  };

  const removeBadgeNumberEvent = () => {
    Mapp.removeBadgeNumber();
  };

  const lockOrientationEvent = () => {
    // Mapp.engage("5c59a56fd39ce9.45048743","1028993954364","https://jamie-test.shortest-route.com","263176","55")
  };

  const engageEvent = () => {
    Mapp.engage(
      '5fd76d903c2247.21400126',
      '1028993954364',
      'TEST',
      '264115',
      '33',
    );
  };

  const engageEvent2 = () => {
    navigateMyApp();
  };

  const addDeeplink = () => {
    Mapp.addDeepLinkingListener((notification) => {
      let action = notification.action;
      let url1 = notification.url;
      // console.log(notification);
      // Alert.alert(notification)
      const uri = new URL(url1);
      const link = uri.searchParams.get('link');
      const message_id = uri.searchParams.get('message_id');
      props.navigation.navigate('Home', {
        myLink: link,
        message_id: message_id,
      });
    });
  };
  const addPushListener = () => {
    Mapp.addPushListener((notification) => {
      console.log(JSON.stringify(notification));
      Alert.alert(JSON.stringify(notification));
    });
  };

  const logOut = () => {
    Mapp.logOut(true);
  };

  const openSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScrollView>
      <ImageBackground
        style={{width: '100%'}}
        source={require('../img/promo_image.png')}
        resizeMode={'contain'}
        backgroundColor={'black'}>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native Mapp plugin!
          </Text>
          <MappInputText
            maxLength={255}
            label="Set Device Alias"
            autoCorrect={false}
            autoCapitalize="none"
            value={state.aliasState}
            onChangeText={handleTextChange('aliasState')}
            error={state.defaultError}
            errorMessage={state.defaultErrorMessage}
          />
          <MappButton text={'Set Device Alias'} onPress={setAlias} />
          <MappButton text={'Get Device Alias'} onPress={getAlias} />
          <MappButton text={'Configure server'} onPress={openSettings} />
          <MappButton text={'Device Information'} onPress={getDevice} />
          <MappButton text={'Is Push Enabled'} onPress={isPushEnabled} />
          <MappButton text={'Opt in'} onPress={optIn} />
          <MappButton text={'Opt out'} onPress={optOut} />
          <MappButton text={'Start Geo'} onPress={startGeo} />
          <MappButton text={'Stop Geo'} onPress={stopGeo} />
          <MappButton text={'Fetch inbox messages'} onPress={fetchInbox} />
          <MappButton text={'In App: App Open'} onPress={appOpenEvent} />
          <MappButton
            text={'In App: App Feedback'}
            onPress={appFeedbackEvent}
          />
          <MappButton
            text={'In App: App Discount'}
            onPress={appDiscountEvent}
          />
          <MappButton text={'In App: App Promo'} onPress={appPromoEvent} />
          <MappButton text={'Fcm Token'} onPress={showToken} />

          <Text style={styles.labelText}>FCM Token</Text>
          <Text style={styles.normalText} onPress={copyToClipboard}>
            {state.firebaseToken}
          </Text>

          <MappButton
            text={'Fetch Multiple Messages'}
            onPress={fetchMultipleMessages}
          />
          <MappButton text={'Get Tags'} onPress={getTags} />

          <MappInputText
            maxLength={255}
            label="Set Tags"
            autoCorrect={false}
            autoCapitalize="none"
            value={state.setTags}
            onChangeText={handleTextChange('setTags')}
            error={state.defaultError}
            errorMessage={state.defaultErrorMessage}
          />
          <MappButton text={'Set Tags'} onPress={setTagsEvent} />

          <MappInputText
            maxLength={255}
            label="Remove Tags"
            autoCorrect={false}
            autoCapitalize="none"
            value={state.removeTags}
            onChangeText={handleTextChange('removeTags')}
            error={state.defaultError}
            errorMessage={state.defaultErrorMessage}
          />
          <MappButton text={'Remove Tag'} onPress={removeTagEvent} />
          <MappInputText
            maxLength={255}
            label="Set Attribute"
            autoCorrect={false}
            autoCapitalize="none"
            value={state.addAttribute}
            onChangeText={handleTextChange('addAttribute')}
            error={state.defaultError}
            errorMessage={state.defaultErrorMessage}
          />
          <MappButton text={'Set Attribute'} onPress={setAttributeEvent} />
          <MappInputText
            maxLength={255}
            label="Get Attribute"
            autoCorrect={false}
            autoCapitalize="none"
            value={state.getAttribute}
            onChangeText={handleTextChange('getAttribute')}
            error={state.defaultError}
            errorMessage={state.defaultErrorMessage}
          />
          <MappButton text={'Get Attribute'} onPress={getAttributeEvent} />
          <MappInputText
            maxLength={255}
            label="Remove Attribute"
            autoCorrect={false}
            autoCapitalize="none"
            value={state.removeAttribute}
            onChangeText={handleTextChange('removeAttribute')}
            error={state.defaultError}
            errorMessage={state.defaultErrorMessage}
          />
          <MappButton
            text={'Remove Attribute'}
            onPress={removeAttributeEvent}
          />
          <MappButton
            text={'Remove Badge Number'}
            onPress={removeBadgeNumberEvent}
          />
          <MappButton
            text={'Lock Orientation'}
            onPress={lockOrientationEvent}
          />
          <MappButton text={'Engage'} onPress={engageEvent} />
          <MappButton text={'Engage2'} onPress={engageEvent2} />
          <MappButton text={'Deep links'} onPress={addDeeplink} />
          <MappButton text={'Push listener'} onPress={addPushListener} />
          <MappButton text={'Log out'} onPress={logOut} />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

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

  infoText: {
    color: '#FFFFFF',
    fontWeight: 'normal',
    fontSize: 14,
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

export default HomeScreen;
