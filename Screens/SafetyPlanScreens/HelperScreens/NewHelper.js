import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import { PressableIcon } from '../../../Components/PressableIcon';
import store from '../../../Redux/store';
import { updateHelper, getHelper } from '../../../Redux/actions';
import { TabStyles } from '../../../Styles/TabStyles';
import { updateDatabase, updateDatabaseArgument, readDatabaseArg } from '../../../Util/DatabaseHelper';
import { DbTableNames, UsageFunctionIds } from '../../../Constants/Constants';
import { latestSafetyPlanItem } from '../../../Util/Usage';

export default class NewHelper extends React.Component {
  static navigationOptions = {
    title: 'New Helper',
  };

  constructor(props) {
    super(props);

    this.state = {
      resp: '',
      contact: 'Contact',
      validResp: true,
      validContact: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const checkedContact = nextProps.navigation.getParam('checkedContact', null);

    if (checkedContact !== this.props.navigation.getParam('checkedContact', null)) {
      if (checkedContact !== null) {
        this.setState({
          contact: checkedContact.contactName,
        });
      } else {
        console.log('no contact checked');
      }
    }
  }
  // listen for new props coming from pre-populated screen and update accordingly

  updateHelperList = (helper) => {
    store.dispatch(updateHelper(helper));
    // dispatching new Helper name to global redux store
  };

  refreshDb = (func) => {
    readDatabaseArg(
      'h.*, c.contactId, c.firstName, c.surname',
      DbTableNames.helper,
      func,
      () => console.log('DB read success'),
      ' as h inner join ' + DbTableNames.contact + ' as c' + ' on h.contactId = c.contactId where h.dateDeleted is NULL'
    );
  };
  // for refreshing global state from Helper table in DB

  updateGlobalHelpers = (helpers) => store.dispatch(getHelper(helpers));

  postSaveFunctions = (helperId) => {
    this.refreshDb(this.updateGlobalHelpers);

    this.updateFunctionUsage(helperId.insertId);
    // keeping track of new helper entries for 'my stats'
  };
  // if media was selected -> update that row with path

  updateFunctionUsage = (helperId) => {
    latestSafetyPlanItem(UsageFunctionIds.lastEntered.helper, helperId, 'test');
  };

  onPress = () => {
    if (this.state.resp.length === 0 && this.state.contact === 'Contact') {
      this.setState({
        validResp: false,
        validContact: false,
      });
    } else if (this.state.resp.length === 0) {
      this.setState({
        validResp: false,
        validContact: true,
      });
    } else if (this.state.contact === 'Contact') {
      this.setState({
        validContact: false,
        validResp: true,
      });
    } else {
      updateDatabase(
        DbTableNames.helper,
        [this.state.resp, this.props.navigation.getParam('checkedContact').contactId],
        ['responsibility', 'contactId'],
        this.updateHelperList({ firstName: this.state.contact }),
        this.postSaveFunctions
      );
      // write the saved values to DB if valid

      this.props.navigation.pop();
      // pop to helper list once saved
    }
  };

  render() {
    return (
      <View style={TabStyles.planContainer}>
        <View style={helperStyle.formContainer}>
          <PressableIcon
            iconName="ios-arrow-dropright-outline"
            size={25}
            onPressFunction={() => this.props.navigation.push('contactList')}
            name={this.state.contact}
            buttonContainerStyle={{ flex: 1, flexDirection: 'row' }}
            buttonStyle={[helperStyle.listButton, this.state.validContact ? {} : { borderColor: '#a94442' }]}
            textStyle={{ alignSelf: 'center', paddingLeft: 7, fontSize: 17, flex: 6 }}
            iconStyle={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}
          />
          <TextInput
            style={[helperStyle.respInput, this.state.validResp ? {} : { borderColor: '#a94442' }]}
            placeholder={'How they can help me'}
            value={this.state.resp}
            onChangeText={(text) => this.setState({ resp: text })}
            underlineColorAndroid={'transparent'}
          />
          <TouchableHighlight style={helperStyle.button} onPress={this.onPress} underlayColor="#99d9f4">
            <Text style={helperStyle.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const helperStyle = StyleSheet.create({
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
  respInput: {
    height: 36,
    borderColor: '#cccccc', // <= relevant style here
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: 'white',
    paddingHorizontal: 7,
    fontSize: 17,
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
