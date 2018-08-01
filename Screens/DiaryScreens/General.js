import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icons } from '../../Constants/Icon';
import SleepScale from '../../Components/SleepScale';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
    };
  };
  // static property called navigationOptions that belongs to all screen components

  render() {
    return (
      <View style={generalStyle.listContainer}>
        <View style={generalStyle.sleep}>
          <Text style={generalStyle.sleepText}>Sleep Scale</Text>
          <SleepScale />
        </View>
        <View style={{ flex: 2.5, marginLeft: 15, marginRight: 15 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, paddingBottom: 15 }}>General Notes</Text>
          <TextInput
            multiline={true}
            style={{
              backgroundColor: '#f0f0f5',
              flex: 1,
              borderRadius: 7,
              borderWidth: 1,
              padding: 15,
              paddingBottom: 15,
              paddingTop: 15,
              textAlignVertical: 'top',
            }}
            placeholder="User can enter personal thoughts and notes here"
            placeholderTextColor="black"
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity style={generalStyle.button} onPress={() => console.log('saved')}>
            <Text style={generalStyle.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const generalStyle = StyleSheet.create({
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },

  sleep: {
    //flex: 2
  },

  sleepText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 15,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 18,
    color: '#007AFF',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
