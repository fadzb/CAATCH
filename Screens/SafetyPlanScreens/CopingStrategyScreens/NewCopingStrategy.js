import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import { PressableIcon } from '../../../Components/PressableIcon';
import store from '../../../Redux/store';
import { updateCoping } from '../../../Redux/actions';

import { TabStyles } from '../../../Styles/TabStyles';
import { updateDatabase } from '../../../Util/DatabaseHelper';
import { mediaPicker } from '../../../Util/Media';

const Form = t.form.Form;

const cope = t.struct({
  copeName: t.String,
  copeDesc: t.String,
  copeUrl: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
  fields: {
    copeName: {
      placeholder: 'Name',
      auto: 'none',
    },
    copeDesc: {
      placeholder: 'Description',
      auto: 'none',
    },
    copeUrl: {
      placeholder: 'URL',
      auto: 'none',
    },
  },
};
// for customizing form UI

export default class NewCopingStrategy extends React.Component {
  static navigationOptions = {
    title: 'New Strategy',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const checkedStrat = nextProps.navigation.getParam('checkedStrats', null);

    if (checkedStrat !== this.props.navigation.getParam('checkedStrats', null)) {
      if (checkedStrat !== null) {
        this.setState({
          value: {
            copeName: checkedStrat[0],
            copeDesc: '',
            copeUrl: '',
          },
        });
      } else {
        console.log('no strat checked');
      }
    }
  }
  // listen for new props coming from pre-populated screen and update accordingly

  clearForm = () => {
    this.setState({ value: null });
  };
  // clear content from all form inputs

  onChange = (value) => {
    this.setState({ value: value });
  };

  updateCopeList = (strategy) => {
    store.dispatch(updateCoping(strategy));
    // dispatching new Coping Strategy name to global redux store
  };

  updateLinkDbTable = (copeId) => {
    const checkedSigns = this.props.navigation.getParam('checkedSigns', null);

    if (checkedSigns !== null) {
      checkedSigns.forEach((signId) => {
        updateDatabase('CopeSignLink', [signId, copeId.insertId], ['signId', 'copeId']);
      });
    } else {
      console.log('no signs checked');
    }
  };
  // function that checks if any signs were linked and, if yes, updates CopeSignLink table with respective ID's

  onPress = () => {
    const value = this.refs.form.getValue();
    // returns values captured in form as object

    if (value) {
      // if validation fails, value will be null
      console.log(value);
      updateDatabase(
        'CopingStrategy',
        Object.values(value),
        Object.keys(value),
        this.updateCopeList(value),
        this.updateLinkDbTable
      );
      // write the saved values to DB if valid

      //this.clearForm();
      // clear form once DB is updated

      this.props.navigation.pop();
      // pop to strategy list once saved
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={copeStyle.formContainer}>
          <Form ref="form" type={cope} value={this.state.value} onChange={this.onChange} options={options} />
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('warningLink')}
            name="Warning Sign"
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={copeStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('prePopCope')}
            name="Import"
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={copeStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <TouchableHighlight style={copeStyle.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={copeStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <PressableIcon
            iconName="ios-images-outline"
            size={80}
            onPressFunction={mediaPicker}
            buttonStyle={copeStyle.iconButton}
          />
        </View>
      </View>
    );
  }
}

const copeStyle = StyleSheet.create({
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
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 2,
    margin: 40,
  },
  iconButton: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  },
  listButton: {
    height: 36,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
  },
});
