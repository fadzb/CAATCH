import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiPicker from 'react-native-multiple-select-list';

import { readDatabaseArg } from '../../../Util/DatabaseHelper';

export default class DistractContactLink extends React.Component {
  static navigationOptions = {
    title: 'Contacts',
  };

  constructor(props) {
    super(props);

    this.state = {
      contacts: {},
      checkedContacts: [],
    };
  }

  componentDidMount() {
    readDatabaseArg(
      '*',
      'Contact',
      this.updateContacts,
      () => console.log('DB read success'),
      'where dateDeleted is NULL'
    );
  }
  // read DB for all currently saved contacts where dateDeleted is null

  updateContacts = (contacts) => {
    const contactStruct = {};
    contacts.forEach((c) => {
      if (c.surname === null) {
        contactStruct[c.contactId] = c.firstName;
      } else {
        contactStruct[c.contactId] = c.firstName + ' ' + c.surname;
      }
    });

    this.setState({ contacts: contactStruct });
  };
  // function that creates object with contactId as key and contactName as value. Then setStates with that object

  getCheckedContacts = (contacts) => {
    this.setState({
      checkedContacts: contacts.filter((c) => c !== undefined),
    });
  };
  // Updates state everytime option is checked/unchecked

  render() {
    return (
      <View style={contactLinkStyle.viewContainer}>
        <CustomMultiPicker
          options={this.state.contacts}
          multiple={true} //
          returnValue={'contactId'} // label or value
          callback={this.getCheckedContacts} // callback, array of selected items
          rowBackgroundColor={'#fff'}
          rowHeight={40}
          rowRadius={5}
          iconColor={'#00a2dd'}
          iconSize={25}
          itemStyle={contactLinkStyle.itemStyle}
          selectedIconName={'ios-checkmark-circle-outline'}
          unselectedIconName={'ios-radio-button-off-outline'}
          selected={
            this.props.navigation.getParam('selectedContacts') !== undefined
              ? this.props.navigation.getParam('selectedContacts').map((sc) => sc.contactId.toString())
              : undefined
          }
        />
        <TouchableHighlight
          style={contactLinkStyle.button}
          onPress={
            this.props.navigation.getParam('edit')
              ? () => this.props.navigation.navigate('editDistraction', { checkedContacts: this.state.checkedContacts })
              : () => this.props.navigation.navigate('newDistraction', { checkedContacts: this.state.checkedContacts })
          }
          underlayColor="#99d9f4"
        >
          <Text style={contactLinkStyle.buttonText}>Done</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const contactLinkStyle = StyleSheet.create({
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
