import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import { readDatabase } from '../../../Util/DatabaseHelper';
import { SafetyPlanSectionRow } from '../../../Components/SafetyPlanSectionRow';

import { TabStyles } from '../../../Styles/TabStyles';

export default class CopingStrategies extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Coping Strategies',
      headerRight: <Button onPress={() => navigation.push('newCoping')} title="New +" color="#000" />,
    };
  };
  // Implementation for 'new' strategy button

  constructor(props) {
    super(props);

    this.state = {
      strategies: [],
    };
  }

  componentDidMount() {
    readDatabase('*', 'CopingStrategy', this.updateStrategies);
  }

  updateStrategies = (strats) => {
    const strategies = strats.map((s) => s.copeName);

    this.setState({
      strategies: strategies,
    });
  };

  render() {
    return (
      <View style={stratStyle.viewContainer}>
        <FlatList
          data={this.state.strategies}
          renderItem={({ item }) => (
            <View style={stratStyle.listContainer}>
              <SafetyPlanSectionRow name={item} />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const stratStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
