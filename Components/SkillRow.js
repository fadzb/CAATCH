import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Alert, Switch, Dimensions } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import PropTypes from 'prop-types';
import store from '../Redux/store';
import { updateSkillRating } from '../Redux/actions';
import { PressableIcon } from './PressableIcon';
import { Icons } from '../Constants/Icon';

export default class SkillRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: false,
    };
  }

  componentDidMount() {
    this.setState(
      {
        selectedIndex: this.props.prevSelected === null ? false : this.props.prevSelected !== 0,
      },
      () => this.updateIndex(this.state.selectedIndex)
    );
    // set state with previously saved selections, if any, and update global state
  }

  updateIndex = (selectedIndex) => {
    this.setState({ selectedIndex });

    store.dispatch(updateSkillRating({ id: this.props.index, rating: selectedIndex ? 1 : 0 }));
  };
  // when user selects Y or N, update global ratings store

  infoAlert = () => {
    Alert.alert(this.props.name, this.props.info, [{ text: 'OK', onPress: () => console.log('OK pressed') }], {
      cancelable: false,
    });
  };
  // alert for displaying skill info

  render() {
    //const buttons = ['Yes', 'No'];

    return (
      <View style={skillRowStyle.container}>
        <TouchableHighlight underlayColor="#FDEDEC" style={skillRowStyle.button} onPress={this.props.onPress}>
          <View style={skillRowStyle.rowContainer}>
            <View style={skillRowStyle.textContainer}>
              <PressableIcon
                iconName={Icons.info + '-outline'}
                size={25}
                onPressFunction={this.infoAlert}
                color="#007AFF"
              />
              <Text style={skillRowStyle.buttonText}>{this.props.name}</Text>
            </View>
            <Switch
              onValueChange={this.updateIndex}
              value={this.state.selectedIndex}
              style={skillRowStyle.buttonContainer}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

SkillRow.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};
// Defining prop types for this component

const skillRowStyle = StyleSheet.create({
  button: {
    flex: 1,
    borderBottomWidth: 0.5,
    marginLeft: 10,
    marginRight: 10,
  },

  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flex: 1,
  },
  // need to wrap button in View in order to stretch to full width of screen using flexDirection

  buttonText: {
    fontSize: 15,
    paddingLeft: 5,
    flex: 1,
  },

  textContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
  },

  buttonContainer: {
    //flex: 1,
    //transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }]
    marginRight: 5,
  },

  buttonGroup: {
    backgroundColor: 'white',
  },

  buttonGroupText: {
    color: '#007AFF',
  },

  buttonGroupSelected: {
    backgroundColor: '#007AFF',
  },

  buttonGroupSelectedText: {
    color: 'white',
  },
});
