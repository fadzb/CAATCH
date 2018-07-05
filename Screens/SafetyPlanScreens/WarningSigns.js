import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import { db } from '../../Util/DatabaseConnector';

export default class WarningSigns extends React.Component {
  static navigationOptions = {
    title: 'Warning Signs',
  };

  constructor(props) {
    super(props);

    this.state = {
      textVal: '',
    };
  }

  updateDatabase = () => {
    db.transaction(
      (tx) => {
        tx.executeSql('insert into CopingStrategy (copeDesc) values (?)', [this.state.textVal]);
      },
      (err) => console.log(err),
      this.readDatabase
    );
  };
  // Test to ensure SQL insert works

  readDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql('select * from CopingStrategy', [], (_, resultSet) => console.log(resultSet.rows._array));
    });
  };
  // Test to ensure SQL select works

  render() {
    return (
      <View>
        <Text>Warning Sign</Text>
        <TextInput value={this.state.textVal} onChangeText={(text) => this.setState({ textVal: text })} />
        <Button title="Update DB" onPress={this.updateDatabase} />
      </View>
    );
  }
}
