import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';
import CustomMultiSelectList from '../../../Components/CustomMultiSelectList';

import { readDatabaseArg } from '../../../Util/DatabaseHelper';
import { DbTableNames } from '../../../Constants/Constants';

export default class ContactList extends React.Component {
  static navigationOptions = {
    title: 'Contacts',
  };

  constructor(props) {
    super(props);

    this.state = {
      contacts: {},
      checkedContact: [],
    };
  }

  componentDidMount() {
    readDatabaseArg(
      '*',
      DbTableNames.contact,
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

  getCheckedContact = (contacts) => {
    this.setState({
      checkedContact: contacts.filter((c) => c !== undefined),
    });
  };
  // Updates state everytime option is checked/unchecked

  render() {
    return (
      <View style={contactListStyle.viewContainer}>
        <CustomMultiSelectList
          options={this.state.contacts}
          multiple={false} //
          returnValue={'contactId'} // label or value
          callback={this.getCheckedContact} // callback, array of selected items
          rowBackgroundColor={'#fff'}
          rowRadius={5}
          iconColor={'#00a2dd'}
          iconSize={25}
          itemStyle={contactListStyle.itemStyle}
          search={true}
          selectedIconName={'ios-checkmark-circle-outline'}
          unselectedIconName={'ios-radio-button-off-outline'}
          selected={
            this.props.navigation.getParam('selectedContacts') !== undefined
              ? this.props.navigation.getParam('selectedContacts').map((sc) => sc.contactId.toString())
              : undefined
          }
        />
        <TouchableHighlight
          style={contactListStyle.button}
          onPress={
            this.props.navigation.getParam('edit')
              ? () =>
                  this.props.navigation.navigate('editHelper', {
                    checkedContact: {
                      contactId: Number(this.state.checkedContact[0]),
                      contactName: this.state.contacts[this.state.checkedContact[0]],
                    },
                  })
              : () =>
                  this.props.navigation.navigate('newHelper', {
                    checkedContact: {
                      contactId: Number(this.state.checkedContact[0]),
                      contactName: this.state.contacts[this.state.checkedContact[0]],
                    },
                  })
          }
          underlayColor="#99d9f4"
        >
          <Text style={contactListStyle.buttonText}>Done</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const contactListStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
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
