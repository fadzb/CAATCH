import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View, WebView, TouchableOpacity } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';

export default class Pdf extends React.Component {
  constructor(props) {
    super(props);
  }

  printDoc = () => {
    Expo.DangerZone.Print.printAsync({
      uri: 'http://192.168.0.101:3000/pdf',
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <View style={pdfStyle.container}>
        <PDFReader source={{ uri: 'http://192.168.0.101:3000/pdf' }} />
        <TouchableOpacity onPress={() => this.printDoc()} style={{ backgroundColor: 'red', height: 50, width: 50 }} />
      </View>
    );
  }
  // for android need to change 'localhost' to local IP address of server -> System Preferences (Network)
}

const pdfStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});
