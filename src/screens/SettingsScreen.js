import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';

const SettingsScreen = ({navigation}) => {
  const [configuration, setConfiguration] = useState({});

  const setConfig = (config) => {
    if (config !== null && config != configuration) {
      setConfiguration(config);
    }
  };

  const loadConfig = async () => {
    try {
      const json = await AsyncStorage.getItem('@config');
      return json !== null ? JSON.parse(json) : {};
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadConfig().then((config) => {
      console.log('SettingsScreen', config);
      setConfig(config);
    });
  }, []);

  const saveConfigurationAndClose = async () => {
    try {
      await AsyncStorage.setItem('@config', JSON.stringify(configuration));
      navigation.navigate('Home', {config: configuration});
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.root}>
        <Text style={styles.sectionLabel}>App ID</Text>
        <TextInput
          style={styles.textInput}
          placeholderTextColor="gray"
          placeholder="App ID"
          value={configuration.appId}
          onChangeText={(text) => {
            setConfig({...configuration, appId: text});
          }}
        />
        <Text style={styles.sectionLabel}>SDK Key</Text>
        <TextInput
          style={styles.textInput}
          placeholderTextColor="gray"
          placeholder="SDK Key"
          value={configuration.sdkKey}
          onChangeText={(text) => {
            setConfig({...configuration, sdkKey: text});
          }}
        />
        <Text style={styles.sectionLabel}>Tenat ID</Text>
        <TextInput
          style={styles.textInput}
          placeholderTextColor="gray"
          placeholder="Tenat ID"
          value={configuration.tenatId}
          onChangeText={(text) => {
            setConfig({...configuration, tenatId: text});
          }}
        />
        <Text style={styles.sectionLabel}>Server</Text>
        <Picker
          style={styles.pickerSection}
          selectedValue={configuration.server}
          onValueChange={(itemValue, index) => {
            setConfig({...configuration, server: itemValue});
          }}>
          <Picker.Item label="L3" value="L3" />
          <Picker.Item label="L3_US" value="L3_US" />
          <Picker.Item label="EMC" value="EMC" />
          <Picker.Item label="EMC_US" value="EMC_US" />
          <Picker.Item label="CROC" value="CROC" />
          <Picker.Item label="TEST" value="TEST" />
          <Picker.Item label="TEST_55" value="TEST_55" />
        </Picker>
      </ScrollView>

      <View style={styles.bottom}>
        <Button title="Set configuration" onPress={saveConfigurationAndClose} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },

  textInput: {
    fontSize: 14,
    color: 'black',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  sectionLabel: {
    color: 'blue',
  },

  pickerSection: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginVertical: 16,
  },
});

export default SettingsScreen;
