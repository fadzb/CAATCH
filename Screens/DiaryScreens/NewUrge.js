import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import { PressableIcon } from '../../Components/PressableIcon';
import store from '../../Redux/store';
import { updateReason, getReason, newFeeling } from '../../Redux/actions';
import Expo from 'expo';
import { Icons } from '../../Constants/Icon';

import { TabStyles } from '../../Styles/TabStyles';
import { updateDatabase, updateDatabaseArgument, readDatabaseArg } from '../../Util/DatabaseHelper';
import { DbTableNames, UsageFunctionIds } from '../../Constants/Constants';
import { latestSafetyPlanItem } from '../../Util/Usage';
import { updateDiaryPrePops } from '../../Constants/Prepopulated';

const Form = t.form.Form;

const reason = t.struct({
  diaryName: t.String,
  info: t.maybe(t.String),
});
// data structure for values to be capture in form below

const options = {
  fields: {
    diaryName: {
      placeholder: 'Name',
      auto: 'none',
    },
    info: {
      placeholder: 'Info',
      auto: 'none',
    },
  },
};
// for customizing form UI

export default class NewUrge extends React.Component {
  static navigationOptions = {
    title: 'New Urge',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  onChange = (value) => {
    this.setState({ value: value });
  };

  onPress = () => {
    const value = this.refs.form.getValue();
    // returns values captured in form as object

    if (value) {
      // if validation fails, value will be null
      console.log(value);
      updateDatabase(
        DbTableNames.diary,
        [...Object.values(value), this.props.navigation.getParam('subType'), 'Feeling', 5],
        [...Object.keys(value), 'subType', 'diaryType', 'scale'],
        () =>
          updateDiaryPrePops(() => {
            this.props.navigation.navigate('feelings', { newFeeling: value.diaryName });
          }),
        (res) => store.dispatch(newFeeling({ id: res.insertId, rating: 0 }))
      );
      // write the saved values to DB if valid
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={urgeStyle.formContainer}>
          <Form ref="form" type={reason} value={this.state.value} onChange={this.onChange} options={options} />
          <TouchableHighlight style={urgeStyle.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={urgeStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const urgeStyle = StyleSheet.create({
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
    margin: 40,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  listButton: {
    height: 36,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
