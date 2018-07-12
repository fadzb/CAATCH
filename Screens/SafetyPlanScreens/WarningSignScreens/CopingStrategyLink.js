import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from 'react-native-multiple-select-list';

import { readDatabase } from '../../../Util/DatabaseHelper';

export default class CopingStrategyLink extends React.Component {
  static navigationOptions = {
    title: 'Coping Strategies',
  };

  constructor(props) {
    super(props);

    this.state = {
      copes: {},
      checkedCopes: [],
    };
  }

  componentDidMount() {
    readDatabase('*', 'CopingStrategy', this.updateCopes);
  }
  // read DB for all currently saved coping Strategies

  updateCopes = (copes) => {
    const copeStruct = {};
    copes.forEach((c) => (copeStruct[c.copeId] = c.copeName));

    this.setState({ copes: copeStruct });
  };
  // function that creates object with copeId as key and copeName as value. Then setStates with that object

  getCheckedCopes = (copes) => {
    this.setState({
      checkedCopes: copes.filter((c) => c !== undefined),
    });
  };
  // Updates state everytime option is checked/unchecked

  render() {
    return (
      <View style={copeLinkStyle.viewContainer}>
        <CustomMultiPicker
          options={this.state.copes}
          multiple={true} //
          returnValue={'copeId'} // label or value
          callback={this.getCheckedCopes} // callback, array of selected items
          rowBackgroundColor={'#fff'}
          rowHeight={40}
          rowRadius={5}
          iconColor={'#00a2dd'}
          iconSize={25}
          itemStyle={copeLinkStyle.itemStyle}
          selectedIconName={'ios-checkmark-circle-outline'}
          unselectedIconName={'ios-radio-button-off-outline'}
        />
        <TouchableHighlight
          style={copeLinkStyle.button}
          onPress={() => this.props.navigation.navigate('newWarning', { checkedCopes: this.state.checkedCopes })}
          underlayColor="#99d9f4"
        >
          <Text style={copeLinkStyle.buttonText}>Done</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const copeLinkStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  itemStyle: {
    borderBottomWidth: 3,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
