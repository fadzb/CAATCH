// Screen for displaying phones contacts in sorted and selectable section list

import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, SectionList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { ContactRow } from '../../../Components/ContactRow';

export default class PhoneContacts extends React.Component {
  static navigationOptions = {
    title: 'Phone Contacts',
  };

  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      searchText: '',
      originalContacts: [],
    };
  }

  componentDidMount() {
    this.setState(
      {
        contacts: this.props.navigation
          .getParam('contacts')
          .map((c) => {
            let phone = '';
            let email = '';

            if (c.phoneNumbers.length !== 0) {
              phone = c.phoneNumbers[0].number;
            }

            if (c.emails.length !== 0) {
              email = c.emails[0].email;
            }

            return {
              name: c.name,
              firstName: c.firstName,
              surname: c.lastName,
              phone: phone,
              email: email,
            };
          })
          .sort(this.compareNames),
      },
      () => this.setState({ originalContacts: [...this.state.contacts] })
    );
  }

  compareNames = (contact1, contact2) => {
    if (contact1.name.toUpperCase() < contact2.name.toUpperCase()) {
      return -1;
    } else if (contact1.name.toUpperCase() > contact2.name.toUpperCase()) {
      return 1;
    } else {
      return 0;
    }
  };

  handleChangeText = (text) => {
    let contactArr;

    this.setState((prevState) => {
      if (this.state.searchText.length > text.length) {
        contactArr = this.state.originalContacts;
      } else {
        contactArr = [...prevState.contacts];
      }

      return {
        contacts: contactArr.filter((c) => c.name.toUpperCase().includes(text.toUpperCase())),
        searchText: text,
      };
    });
  };
  // filters contact list based on user input to search box

  renderItem = (obj) => (
    <View style={phoneContactStyle.listContainer}>
      <ContactRow
        name={obj.item.name}
        number={obj.item.phone}
        onPress={
          this.props.navigation.getParam('edit')
            ? () => this.props.navigation.navigate('editContact', { checkedContact: obj.item })
            : () => this.props.navigation.navigate('newContact', { checkedContact: obj.item })
        }
      />
    </View>
  );

  renderSectionHeader = (obj) => (
    <View style={phoneContactStyle.sectionHeader}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{obj.section.title}</Text>
    </View>
  );

  render() {
    const contactsByLetter = this.state.contacts.reduce((obj, contact) => {
      const firstLetter = contact.name[0].toUpperCase();

      return {
        ...obj,
        [firstLetter]: [...(obj[firstLetter] || []), contact],
      };
    }, {});

    const sections = Object.keys(contactsByLetter)
      .sort()
      .map((letter) => ({
        title: letter,
        data: contactsByLetter[letter],
      }));

    return (
      <View style={phoneContactStyle.viewContainer}>
        <SearchBar
          onChangeText={this.handleChangeText}
          placeholder="Type Here..."
          //autoCapitalize={'none'}
          placeholderTextColor={'white'}
          icon={{ color: 'white' }}
        />
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          sections={sections}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const phoneContactStyle = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  sectionHeader: {
    flex: 1,
    alignItems: 'stretch',
    padding: 15,
  },
});
