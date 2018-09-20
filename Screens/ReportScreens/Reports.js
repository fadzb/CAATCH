import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';

export default class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  updateReport = () => {
    fetch('http://192.168.0.101:3000/pdf', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: this.state.text,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .then(() => this.props.navigation.navigate('pdf'))
      .catch((err) => console.log(err));
  };
  // for android need to change 'localhost' to local IP address of server -> System Preferences (Network)

  updateText = (text) => {
    this.setState({ text: text });
  };

  render() {
    return (
      <View style={reportStyle.container}>
        <TextInput onChangeText={this.updateText} />
        <Button title="update PDF" onPress={this.updateReport} />
      </View>
    );
  }
}

const reportStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Expo.Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
