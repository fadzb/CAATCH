import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import { PressableIcon } from '../../../Components/PressableIcon';
import store from '../../../Redux/store';
import { updateSign, getSign } from '../../../Redux/actions';
import Expo from 'expo';

import { TabStyles, themeStyles, AppColors } from '../../../Styles/TabStyles';
import {
  updateDatabase,
  updateDatabaseArgument,
  readDatabaseArg,
  deleteDatabaseRow,
} from '../../../Util/DatabaseHelper';
import { DbTableNames } from '../../../Constants/Constants';

const Form = t.form.Form;

const sign = t.struct({
  signName: t.String,
  signDesc: t.String,
});
// data structure for values to be capture in form below

const options = {
  fields: {
    signName: {
      placeholder: 'Name',
      auto: 'none',
    },
    signDesc: {
      placeholder: 'Description',
      auto: 'none',
    },
  },
};
// for customizing form UI

export default class EditWarningSign extends React.Component {
  static navigationOptions = {
    title: 'Edit Sign',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: {
        signName: this.props.navigation.getParam('name'),
        signDesc: this.props.navigation.getParam('desc'),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const checkedSign = nextProps.navigation.getParam('checkedSigns', null);

    if (checkedSign !== this.props.navigation.getParam('checkedSigns', null)) {
      if (checkedSign !== null) {
        this.setState({
          value: {
            signName: checkedSign[0],
            signDesc: '',
          },
        });
      } else {
        console.log('no sign checked');
      }
    }
  }
  // listen for new props coming from pre-populated screen and update accordingly

  onChange = (value) => {
    this.setState({ value: value });
  };

  updateSignList = (sign) => {
    store.dispatch(updateSign(sign));
    // dispatching new Warning Sign name to global redux store
  };

  updateLinkDbTable = () => {
    const checkedCopes = this.props.navigation.getParam('checkedCopes', null);

    if (checkedCopes !== null) {
      deleteDatabaseRow(DbTableNames.copeSignLink, 'where signId = ' + this.props.navigation.getParam('id'));

      checkedCopes.forEach((copeId) => {
        updateDatabase(DbTableNames.copeSignLink, [copeId, this.props.navigation.getParam('id')], ['copeId', 'signId']);
      });
    }

    readDatabaseArg(
      '*',
      DbTableNames.warningSign,
      (signs) => store.dispatch(getSign(signs)),
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
  };
  // function that checks if any copes were linked and, if yes, updates CopeSignLink table with respective ID's

  copingLinkNav = () => {
    const currentSignId = this.props.navigation.getParam('id');
    const linkTable = 'CopeSignLink';
    const columnQuery =
      'c.copeId, c.copeName, c.copeDesc, c.copeUrl, c.mediaPath, c.mediaType, c.dateEntered, c.dateDeleted';

    readDatabaseArg(
      columnQuery,
      DbTableNames.copingStrategy,
      (strats) => {
        this.props.navigation.push('copingLink', { selectedStrats: strats, edit: true });
        console.log(strats);
      },
      undefined,
      'as c inner join ' +
        linkTable +
        ' as s on c.copeId = s.copeId where signId = ' +
        currentSignId +
        ' AND c.dateDeleted is null'
    );
  };

  onPress = () => {
    const value = this.refs.form.getValue();
    // returns values captured in form as object

    if (value) {
      // if validation fails, value will be null
      console.log(value);
      updateDatabaseArgument(
        DbTableNames.warningSign,
        Object.values(value),
        Object.keys(value),
        'where signId = ' + this.props.navigation.getParam('id'),
        this.updateSignList(value),
        this.updateLinkDbTable
      );
      // write the saved values to DB if valid

      this.props.navigation.navigate('warning');
      // pop to sign list once saved
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={signStyle.formContainer}>
          <Form ref="form" type={sign} value={this.state.value} onChange={this.onChange} options={options} />
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('prePopSign', { edit: true })}
            name="Import"
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={signStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6, color: AppColors.grey }}
            color={AppColors.grey}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={this.copingLinkNav}
            name="Coping Strategy"
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={signStyle.listButton}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6, color: AppColors.grey }}
            color={AppColors.grey}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <TouchableHighlight
            style={[signStyle.button, themeStyles.planFormSaveButton]}
            onPress={this.onPress}
            underlayColor="#99d9f4"
          >
            <Text style={[signStyle.buttonText, themeStyles.planFormSaveButtonText]}>Save</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const signStyle = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
  },
  button: {
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  listButton: {
    height: 36,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
});
