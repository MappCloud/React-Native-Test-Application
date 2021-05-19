import React, {PureComponent} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import App from "../App";
import {screensEnabled} from 'react-native-screens';
import {
    StyleSheet,
    View,
    Button, Text

} from 'react-native';

screensEnabled();

const Stack = createStackNavigator();

export default function AppMain(): React.ReactElement {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="App" component={App} options={{title: 'Mapp Application'}}/>
                <Stack.Screen name="Home" component={HomeScreen} options={{title: 'DeepLinking'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );

}

function HomeScreen({route, navigation}) {
    const {myLink, message_id = "itIsPush"} = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.text}
            >{"Link=   " + myLink}</Text>
            <Text style={styles.text}
            >{"message_id=   " + message_id}</Text>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    text: {
        fontSize: 20,
        color: '#ffffff',

    },
});
